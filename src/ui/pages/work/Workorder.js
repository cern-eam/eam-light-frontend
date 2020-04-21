import Grid from '@material-ui/core/Grid';
import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import EDMSWidget from 'eam-components/dist/ui/components/edms/EDMSWidget';
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import {TOOLBARS} from "../../components/AbstractToolbar";
import CustomFields from '../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import Entity from '../Entity';
import EamlightToolbar from './../../components/EamlightToolbar';
import Activities from './activities/Activities';
import WorkorderChildren from "./childrenwo/WorkorderChildren";
import MeterReadingContainerWO from './meter/MeterReadingContainerWO';
import WorkorderMultiequipment from "./multiequipmentwo/WorkorderMultiequipment";
import PartUsageContainer from "./partusage/PartUsageContainer";
import WorkorderClosingCodes from './WorkorderClosingCodes';
import WorkorderDetails from './WorkorderGeneral';
import WorkorderScheduling from './WorkorderScheduling';
import WorkorderTools from "./WorkorderTools";
import {assignValues, assignUserDefinedFields, assignCustomFieldFromCustomField} from '../EntityTools';

const assignStandardWorkOrderValues = (workOrder, standardWorkOrder) => {
    const swoToWoMap = ([k, v]) => [k, standardWorkOrder[v]];

    // forced assign values
    workOrder = assignValues(workOrder, Object.fromEntries([
        ['classCode', 'woClassCode'],
        ['typeCode', 'workOrderTypeCode'],
        ['problemCode', 'problemCode'],
        ['priorityCode', 'priorityCode']
    ].map(swoToWoMap), {forced: true}));

    // non-forced assign values
    workOrder = assignValues(workOrder, Object.fromEntries([
        ['description', 'desc'],
    ].map(swoToWoMap)));

    workOrder = assignUserDefinedFields(workOrder, standardWorkOrder.userDefinedFields);
    workOrder = assignCustomFieldFromCustomField(workOrder, standardWorkOrder.customField);

    return workOrder;
};

class Workorder extends Entity {

    constructor(props) {
        super(props);
        this.setProblemCodes(null, null);
        this.setFailureCodes(null, null);
        this.setActionCodes(null, null);
        this.setCauseCodes(null, null);
        this.setPriorityValues();
        this.props.setLayoutProperty('showEqpTreeButton', false);
    }


    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
    settings = {
        userData: this.props.userData,
        entity: 'workorder',
        entityDesc: 'Work Order',
        entityURL: '/workorder/',
        entityCodeProperty: 'number',
        entityScreen: this.props.userData && this.props.userData.screens[this.props.userData.workOrderScreen],
        renderEntity: this.renderWorkOrder.bind(this),
        readEntity: WSWorkorder.getWorkOrder.bind(WSWorkorder),
        updateEntity: WSWorkorder.updateWorkOrder.bind(WSWorkorder),
        createEntity: WSWorkorder.createWorkOrder.bind(WSWorkorder),
        deleteEntity: WSWorkorder.deleteWorkOrder.bind(WSWorkorder),
        initNewEntity: () => WSWorkorder.initWorkOrder("EVNT", this.props.location.search),
        layout: this.props.workOrderLayout,
        layoutPropertiesMap: WorkorderTools.layoutPropertiesMap
    }


    getRegions = () => {
        let user = this.props.userData.eamAccount.userCode
        let screen = this.props.userData.screens[this.props.userData.workOrderScreen].screenCode
        return {
            SCHEDULING: {label: "Scheduling", code: user + "_" + screen+ "_SCHEDULING"},
            CLOSINGCODES: {label: "Closing Codes", code: user + "_" + screen+ "_CLOSINGCODES"},
            PARTUSAGE: {label: "Part Usage", code: user + "_" + screen+ "_PARTUSAGE"},
            CHILDRENWOS: {label: "Children WOs", code: user + "_" + screen+ "_CHILDRENWOS"},
            EDMSDOCS: {label: "EDMS Documents", code: user + "_" + screen+ "_EDMSDOCS"},
            NCRS: {label: "NCRs", code: user + "_" + screen+ "_NCRS"},
            COMMENTS: {label: "Comments", code: user + "_" + screen+ "_COMMENTS"},
            ACTIVITIES: {label: "Activities and BL", code: user + "_" + screen+ "_ACTIVITIES"},
            CHECKLISTS: {label: "Checklists", code: user + "_" + screen+ "_CHECKLISTS"},
            METERREADINGS: {label: "Meter Readings", code: user + "_" + screen+ "_METER_READINGS"},
            CUSTOMFIELDS: {label: "Custom Fields", code: user + "_" + screen+ "_CUSTOMFIELDS"}
        }
    }

    //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        this.setStatuses('', '', true)
        this.setTypes('', '', true, false)
        this.enableChildren()
    }

    postCreate() {
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false);
        this.setTypes(this.state.workorder.statusCode, this.state.workorder.typeCode, false);
        // Comments panel might be hidden
        if (this.comments) {
            this.comments.createCommentForNewEntity();
        }
    }

    postUpdate() {
        this.props.updateMyWorkOrders(this.state.workorder)
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false)
        this.setTypes(this.state.workorder.statusCode, this.state.workorder.typeCode, false)
        // Check if opening a terminated work order
        if (WorkorderTools.isClosedWorkOrder(this.state.workorder.statusCode)) {
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        // Comments panel might be hidden
        if (this.comments) {
            this.comments.createCommentForNewEntity();
        }
    }

    postRead(workorder) {
        this.props.updateMyWorkOrders(workorder)
        this.setStatuses(workorder.statusCode, workorder.typeCode, false)
        this.setTypes(workorder.statusCode, workorder.typeCode, false)
        // Check if opening a terminated work order
        if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        //Set work order equipment
        this.setWOEquipment(workorder.equipmentCode);
    }

    postCopy = () => {
        let fields = this.props.workOrderLayout.fields;
        this.updateEntityProperty("statusCode", fields.workorderstatus.defaultValue ? fields.workorderstatus.defaultValue : "R")
        this.updateEntityProperty("typeCode", fields.workordertype.defaultValue ? fields.workordertype.defaultValue : "CD")
    }

    //
    // DROP DOWN VALUES
    //
    setStatuses(status, type, newwo) {
        WSWorkorder.getWorkOrderStatusValues(this.props.userData.eamAccount.userGroup, status, type, newwo)
            .then(response => {
                this.setLayout({statusValues: response.body.data})
            })
    }

    setTypes(status, type, newwo, ppmwo) {
        WSWorkorder.getWorkOrderTypeValues(this.props.userData.eamAccount.userGroup)
            .then(response => {
                this.setLayout({typeValues: response.body.data})
            })
    }

    setProblemCodes(woclass, objclass) {
        WSWorkorder.getWorkOrderProblemCodeValues(woclass, objclass)
            .then(response => {
                this.setLayout({problemCodeValues: response.body.data})
            })
    }

    setActionCodes(objclass, failurecode, problemcode, causecode) {
        WSWorkorder.getWorkOrderActionCodeValues(objclass, failurecode, problemcode, causecode)
            .then(response => {
                this.setLayout({actionCodeValues: response.body.data})
            })
    }

    setCauseCodes(objclass, failurecode, problemcode) {
        WSWorkorder.getWorkOrderCauseCodeValues(objclass, failurecode, problemcode)
            .then(response => {
                this.setLayout({causeCodeValues: response.body.data})
            })
    }

    setFailureCodes(objclass, problemcode) {
        WSWorkorder.getWorkOrderFailureCodeValues(objclass, problemcode)
            .then(response => {
                this.setLayout({failureCodeValues: response.body.data})
            })
    }

    setPriorityValues() {
        WSWorkorder.getWorkOrderPriorities()
            .then(response => {
                this.setLayout({priorityValues: response.body.data})
            });
    }

    setWOEquipment = (code) => {
        //Only call if the region is available
        if (WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', this.props.workOrderLayout)) {
            WSEquipment.getEquipment(code).then(response => {
                this.setLayout({woEquipment: response.body.data})
            }).catch(error => {
                this.setLayout({woEquipment: undefined})
            });
        }
    };

    postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        this.checklists.readActivities(this.state.workorder.number);
    };

    readStandardWorkOrder = (standardWorkOrderCode, firstTime) => {
        if (!standardWorkOrderCode || ((firstTime && !this.state.layout.newEntity))) {
            return;
        }

        WSWorkorder.getStandardWorkOrder(standardWorkOrderCode).then(response => {
            const standardWorkOrder = response.body.data;
        
            this.setState(state => ({
                workorder: assignStandardWorkOrderValues({...state.workorder}, standardWorkOrder)
            }));
        })
    }

    //
    //
    //
    renderWorkOrder() {
        let props = {
            workorder: this.state.workorder,
            updateWorkorderProperty: this.updateEntityProperty.bind(this),
            layout: this.state.layout,
            workOrderLayout: this.props.workOrderLayout,
            children: this.children,
            setWOEquipment: this.setWOEquipment,
            userData: this.props.userData
        };

        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={this.state.layout.blocking} style={{height: "100%", width: "100%"}}>

                    <EamlightToolbar isModified={this.state.layout.isModified}
                                     newEntity={this.state.layout.newEntity}
                                     entityScreen={this.props.userData.screens[this.props.userData.workOrderScreen]}
                                     entityName="Work Order"
                                     entityKeyCode={this.state.workorder.number}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => this.props.history.push('/workorder')}
                                     deleteHandler={this.deleteEntity.bind(this, this.state.workorder.number)}
                                     width={790}
                                     toolbarProps={{
                                            _toolbarType: TOOLBARS.WORKORDER,
                                            workorder: this.state.workorder,
                                            postInit: this.postInit.bind(this),
                                            setLayout: this.setLayout.bind(this),
                                            newWorkorder: this.state.layout.newEntity,
                                            applicationData: this.props.applicationData,
                                            userGroup: this.props.userData.eamAccount.userGroup,
                                            screencode: this.props.userData.screens[this.props.userData.workOrderScreen].screenCode,
                                            copyHandler: this.copyEntity.bind(this)}
                                     }
                                     entityIcon={<WorkorderIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={this.props.toggleHiddenRegion}
                                     regions={this.getRegions()}
                                     hiddenRegions={this.props.hiddenRegions}>
                    </EamlightToolbar>

                    <div id="entityContent">
                        <Grid container spacing={1}>
                            <Grid item md={6} sm={12} xs={12}>

                                <WorkorderDetails
                                    {...props}
                                    readStandardWorkOrder={this.readStandardWorkOrder}
                                    applicationData={this.props.applicationData} 
                                    userData={this.props.userData} 
                                    newEntity={this.state.layout.newEntity} />

                                {!this.props.hiddenRegions[this.getRegions().SCHEDULING.code] &&
                                WorkorderTools.isRegionAvailable('SCHEDULING', props.workOrderLayout) &&
                                <WorkorderScheduling {...props}/>}


                                {!this.props.hiddenRegions[this.getRegions().CLOSINGCODES.code] &&
                                WorkorderTools.isRegionAvailable('CLOSING_CODES', props.workOrderLayout) &&
                                <WorkorderClosingCodes {...props}/>}

                                {!this.props.hiddenRegions[this.getRegions().PARTUSAGE.code] &&
                                WorkorderTools.isRegionAvailable('PAR', props.workOrderLayout) &&
                                !this.state.layout.newEntity &&
                                <PartUsageContainer workorder={this.state.workorder}
                                                    tabLayout={this.props.workOrderLayout.tabs.PAR}/>}

                                {!this.props.hiddenRegions[this.getRegions().CHILDRENWOS.code] &&
                                WorkorderTools.isRegionAvailable('CWO', props.workOrderLayout) &&
                                !this.state.layout.newEntity &&
                                <WorkorderChildren workorder={this.state.workorder.number}/>}

                            </Grid>
                            <Grid item md={6} sm={12} xs={12}>

                                {!this.props.hiddenRegions[this.getRegions().EDMSDOCS.code] &&
                                 !this.state.layout.newEntity &&
                                 <EDMSDoclightIframeContainer objectType="J" objectID={this.state.workorder.number}/>}

                                {!this.props.hiddenRegions[this.getRegions().NCRS.code] &&
                                !this.state.layout.newEntity &&
                                <EDMSWidget objectID={this.state.workorder.number} objectType="J"
                                                     creationMode="NCR"
                                                     title="NCRs"
                                                     edmsDocListLink={this.props.edmsDocListLink}
                                                     showSuccess={this.props.showSuccess}
                                                     showError={this.props.showError}/>}

                                {!this.props.hiddenRegions[this.getRegions().COMMENTS.code] &&
                                <Comments ref={comments => this.comments = comments}
                                                   entityCode='EVNT'
                                                   entityKeyCode={!this.state.layout.newEntity ? this.state.workorder.number : undefined}
                                                   userCode={this.props.userData.eamAccount.userCode}
                                                   handleError={this.props.handleError}
                                                   allowHtml={true}
                                                   />
                                }

                                {!this.props.hiddenRegions[this.getRegions().ACTIVITIES.code] &&
                                !this.state.layout.newEntity &&
                                <Activities
                                    workorder={this.state.workorder.number}
                                    department={this.state.workorder.departmentCode}
                                    departmentDesc={this.state.workorder.departmentDesc}
                                    layout={this.props.workOrderLayout.tabs}
                                    defaultEmployee={this.props.userData.eamAccount.employeeCode}
                                    defaultEmployeeDesc={this.props.userData.eamAccount.employeeDesc}
                                    postAddActivityHandler={this.postAddActivityHandler}/>}

                                {!this.props.hiddenRegions[this.getRegions().CHECKLISTS.code] &&
                                !this.state.layout.newEntity &&
                                <Checklists workorder={this.state.workorder.number}
                                            printingChecklistLinkToAIS={this.props.applicationData.EL_PRTCL}
                                            maxExpandedChecklistItems={Math.abs(parseInt(this.props.applicationData.EL_MCHLS)) || 50}
                                            getWoLink={wo => '/workorder/' + wo}
                                            ref={checklists => this.checklists = checklists}
                                            showSuccess={this.props.showSuccess}
                                            handleError={this.props.handleError}/>}

                                {!this.props.hiddenRegions[this.getRegions().CUSTOMFIELDS.code] &&
                                  this.props.workOrderLayout.fields.block_5.attribute !== 'H' &&
                                <CustomFields children={this.children}
                                              entityCode='EVNT'
                                              entityKeyCode={this.state.workorder.number}
                                              classCode={this.state.workorder.classCode}
                                              customFields={this.state.workorder.customField}
                                              updateEntityProperty={this.updateEntityProperty.bind(this)}/>}

                                {WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', props.workOrderLayout) &&
                                this.state.layout.woEquipment &&
                                <CustomFields children={this.children}
                                              entityCode='OBJ'
                                              entityKeyCode={this.state.layout.woEquipment.code}
                                              classCode={this.state.layout.woEquipment.classCode}
                                              customFields={this.state.layout.woEquipment.customField}
                                              updateEntityProperty={this.updateEntityProperty.bind(this)}
                                              title="CUSTOM FIELDS EQUIPMENT"
                                              readonly={true}/>}

                                {!this.props.hiddenRegions[this.getRegions().METERREADINGS.code] &&
                                !this.state.layout.newEntity &&
                                <MeterReadingContainerWO equipment={this.state.workorder.equipmentCode}/>}

                                {WorkorderTools.isRegionAvailable('MEC', props.workOrderLayout) &&
                                !this.state.layout.newEntity &&
                                <WorkorderMultiequipment workorder={this.state.workorder.number}/>}

                            </Grid>
                        </Grid>
                    </div>
                </BlockUi>
            </div>
        )
    }
}

export default Workorder;
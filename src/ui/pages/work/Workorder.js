import React from 'react';
import Entity from '../Entity'
import Grid from '@material-ui/core/Grid';
import WorkorderDetails from './WorkorderGeneral'
import WorkorderScheduling from './WorkorderScheduling'
import WorkorderClosingCodes from './WorkorderClosingCodes'
import EamlightToolbar from './../../components/EamlightToolbar'
import CustomFields from '../../components/customfields/CustomFields'
import WSWorkorder from "../../../tools/WSWorkorders"
import BlockUi from 'react-block-ui'
import Activities from './activities/Activities'
import ChecklistsContainer from 'eam-components/dist/ui/components/checklists/ChecklistsContainer';
import EDMSWidgetContainer from 'eam-components/dist/ui/components/edms/EDMSWidgetContainer';
import PartUsageContainer from "./partusage/PartUsageContainer";
import WorkorderTools from "./WorkorderTools"
import WorkorderMultiequipment from "./multiequipmentwo/WorkorderMultiequipment";
import WorkorderChildren from "./childrenwo/WorkorderChildren";
import MeterReadingContainerWO from './meter/MeterReadingContainerWO';
import WSEquipment from "../../../tools/WSEquipment";
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import CommentsContainer from 'eam-components/dist/ui/components/comments/CommentsContainer';
import WorkorderToolbar from "./WorkorderToolbar";
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";

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
        initNewEntity: () => WSWorkorder.initWorkOrder("EVNT", "WSJOBS",
            this.props.userData && this.props.userData.screens[this.props.userData.workOrderScreen].screenCode,
            this.props.location.search)
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
            this.comments.wrappedInstance.createCommentForNewEntity();
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
            this.comments.wrappedInstance.createCommentForNewEntity();
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

    //
    // DROP DOWN VALUES
    //
    setStatuses(status, type, newwo) {
        WSWorkorder.getWorkOrderStatusValues(status, type, newwo)
            .then(response => {
                this.setLayout({statusValues: response.body.data})
            })
    }

    setTypes(status, type, newwo, ppmwo) {
        WSWorkorder.getWorkOrderTypeValues(status, type, newwo, ppmwo)
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
        this.checklists.wrappedInstance.readActivities(this.state.workorder.number);
    };


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
            setWOEquipment: this.setWOEquipment
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
                                     entityToolbar={<WorkorderToolbar workorder={this.state.workorder}
                                                                      postInit={this.postInit.bind(this)}
                                                                      setLayout={this.setLayout.bind(this)}
                                                                      newWorkorder={this.state.layout.newEntity}
                                                                      applicationData={this.props.applicationData}
                                                                      userGroup={this.props.userData.eamAccount.userGroup}
                                                                      screencode={this.props.userData.screens[this.props.userData.workOrderScreen].screenCode}
                                     />}
                                     entityIcon={<WorkorderIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={this.props.toggleHiddenRegion}
                                     regions={this.getRegions()}
                                     hiddenRegions={this.props.hiddenRegions}>
                    </EamlightToolbar>

                    <div className="entityMain">
                        <Grid container spacing={8}>
                            <Grid item md={6} sm={12} xs={12}>

                                <WorkorderDetails {...props}/>


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
                                                    tabLayout={this.props.workOrderLayout.tabs.PAR.fields}/>}

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
                                <EDMSWidgetContainer objectID={this.state.workorder.number} objectType="J"
                                                     creationMode="NCR"
                                                     title="NCRs"
                                                     edmsDocListLink={this.props.edmsDocListLink}/>}

                                {!this.props.hiddenRegions[this.getRegions().COMMENTS.code] &&
                                <CommentsContainer ref={comments => this.comments = comments}
                                                   entityCode='EVNT'
                                                   entityKeyCode={!this.state.layout.newEntity ? this.state.workorder.number : undefined}
                                                   userDesc={this.props.userData.eamAccount.userDesc}/>
                                }

                                {!this.props.hiddenRegions[this.getRegions().ACTIVITIES.code] &&
                                WorkorderTools.isRegionAvailable('ACT_BOO', props.workOrderLayout) &&
                                !this.state.layout.newEntity &&
                                <Activities
                                    workorder={this.state.workorder.number}
                                    department={this.state.workorder.departmentCode}
                                    layout={this.props.workOrderLayout.tabs}
                                    defaultEmployee={this.props.userData.eamAccount.customField.length > 0 ? this.props.userData.eamAccount.customField[0].value : ''}
                                    postAddActivityHandler={this.postAddActivityHandler}/>}

                                {!this.props.hiddenRegions[this.getRegions().CHECKLISTS.code] &&
                                WorkorderTools.isRegionAvailable('ACK', props.workOrderLayout) &&
                                !this.state.layout.newEntity &&
                                <ChecklistsContainer workorder={this.state.workorder.number}
                                                     printingChecklistLinkToAIS={this.props.applicationData.printingChecklistLinkToAIS}
                                                     ref={checklists => this.checklists = checklists}/>}

                                {!this.props.hiddenRegions[this.getRegions().CUSTOMFIELDS.code] &&
                                WorkorderTools.isRegionAvailable('CUSTOM_FIELDS', props.workOrderLayout) &&
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

                                {!this.state.layout.newEntity &&
                                <MeterReadingContainerWO workorder={this.state.workorder.number}/>}

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
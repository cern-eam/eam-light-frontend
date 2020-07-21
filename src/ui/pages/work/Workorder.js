import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import EDMSWidget from 'eam-components/dist/ui/components/edms/EDMSWidget';
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import WS from '../../../tools/WS'
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
import EntityRegions from '../../components/entityregions/EntityRegions';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import {assignValues, assignUserDefinedFields, assignCustomFieldFromCustomField, AssignmentType} from '../EntityTools';

const assignStandardWorkOrderValues = (workOrder, standardWorkOrder) => {
    const swoToWoMap = ([k, v]) => [k, standardWorkOrder[v]];

    workOrder = assignValues(workOrder, Object.fromEntries([
        ['classCode', 'woClassCode'],
        ['typeCode', 'workOrderTypeCode'],
        ['problemCode', 'problemCode'],
        ['priorityCode', 'priorityCode']
    ].map(swoToWoMap)), AssignmentType.SOURCE_NOT_EMPTY);

    workOrder = assignValues(workOrder, Object.fromEntries([
        ['description', 'desc'],
    ].map(swoToWoMap)), AssignmentType.DESTINATION_EMPTY);

    workOrder = assignUserDefinedFields(workOrder, standardWorkOrder.userDefinedFields, AssignmentType.DESTINATION_EMPTY);
    workOrder = assignCustomFieldFromCustomField(workOrder, standardWorkOrder.customField, AssignmentType.DESTINATION_EMPTY);

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

    onChangeStandardWorkOrder = standardWorkOrderCode => {
        if (!standardWorkOrderCode) {
            return;
        }

        return WSWorkorder.getStandardWorkOrder(standardWorkOrderCode).then(response => {
            const standardWorkOrder = response.body.data;
        
            this.setState(state => ({
                workorder: assignStandardWorkOrderValues({...state.workorder}, standardWorkOrder)
            }));
        })
    }

    onChangeEquipment = value => {
        if(!value) {
            return;
        }

        //If there is a value, fetch location, department, cost code
        //and custom fields
        return Promise.all([
            WS.autocompleteEquipmentSelected(value).then(response => {
                const data = response.body.data[0];

                if(!data) {
                    return;
                }

                //Assign values
                this.setState(prevState => ({
                    workorder: {
                        ...prevState.workorder,
                        departmentCode: data.department,
                        departmentDesc: data.departmentdisc, // 'disc' is not a typo (well, it is in Infor's response ;-) )
                        locationCode: data.parentlocation,
                        locationDesc: data.locationdesc,
                        costCode: data.equipcostcode,
                        costCodeDesc: ''
                    }
                }));
            }),
            this.setWOEquipment(value) //Set the equipment work order
        ]).catch(error => {
            //Simply don't assign values
        });
    };

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
        initNewEntity: WSWorkorder.initWorkOrder.bind(WSWorkorder, "EVNT"),
        layout: this.props.workOrderLayout,
        layoutPropertiesMap: WorkorderTools.layoutPropertiesMap,
        handlerFunctions: {
            equipmentCode: this.onChangeEquipment,
            standardWO: this.onChangeStandardWorkOrder
        }
    }


    getRegions = () => {
        const {
            applicationData,
            edmsDocListLink,
            handleError,
            showError,
            showNotification,
            userData,
            workOrderLayout
        } = this.props;
        const { layout, workorder } = this.state;

        const commonProps = {
            workorder,
            layout,
            workOrderLayout,
            userData,
            updateWorkorderProperty: this.updateEntityProperty.bind(this),
            children: this.children,
            setWOEquipment: this.setWOEquipment
        };
        return [
            {
                id: 'DETAILS',
                label: 'Details',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <WorkorderDetails
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 1,
                order: 1
            },
            {
                id: 'SCHEDULING',
                label: 'Scheduling',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('SCHEDULING', commonProps.workOrderLayout),
                render: () => 
                    <WorkorderScheduling {...commonProps} />
                ,
                column: 1,
                order: 2
            },
            {
                id: 'CLOSINGCODES',
                label: 'Closing Codes',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('CLOSING_CODES', commonProps.workOrderLayout),
                render: () => 
                    <WorkorderClosingCodes {...commonProps} />
                ,
                column: 1,
                order: 3
            },
            {
                id: 'PARTUSAGE',
                label: 'Part Usage',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('PAR', commonProps.workOrderLayout),
                render: () => 
                    <PartUsageContainer
                        workorder={workorder}
                        tabLayout={commonProps.workOrderLayout.tabs.PAR} />
                ,
                column: 1,
                order: 4
            },
            {
                id: 'CHILDRENWOS',
                label: 'Child Work Orders',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('CWO', commonProps.workOrderLayout),
                render: () => 
                    <WorkorderChildren workorder={workorder.number} />
                ,
                column: 1,
                order: 4
            },
            {
                id: 'EDMSDOCUMENTS',
                label: 'EDMS Documents',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EDMSDoclightIframeContainer
                        objectType="J"
                        objectID={workorder.number} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 5
            },
            {
                id: 'NCRS',
                label: 'NCRs',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EDMSWidget
                        objectID={workorder.number}
                        objectType="J"
                        creationMode="NCR"
                        edmsDocListLink={edmsDocListLink}
                        showError={showError}
                        showSuccess={showNotification} />
                ,
                column: 2,
                order: 6
            },
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <Comments
                        ref={comments => this.comments = comments}
                        entityCode='EVNT'
                        entityKeyCode={!layout.newEntity ? workorder.number : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7
            },
            {
                id: 'ACTIVITIES',
                label: 'Activities and Booked Labor',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <Activities
                        workorder={workorder.number}
                        department={workorder.departmentCode}
                        departmentDesc={workorder.departmentDesc}
                        layout={workOrderLayout.tabs}
                        defaultEmployee={userData.eamAccount.employeeCode}
                        defaultEmployeeDesc={userData.eamAccount.employeeDesc}
                        postAddActivityHandler={this.postAddActivityHandler} />
                ,
                column: 2,
                order: 8
            },
            {
                id: 'CHECKLISTS',
                label: 'Checklists',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>  (                     
                    <Checklists
                        workorder={workorder.number}
                        printingChecklistLinkToAIS={applicationData.EL_PRTCL}
                        maxExpandedChecklistItems={Math.abs(parseInt(applicationData.EL_MCHLS)) || 50}
                        getWoLink={wo => '/workorder/' + wo}
                        ref={checklists => this.checklists = checklists}
                        showSuccess={showNotification}
                        showError={showError}
                        handleError={handleError}
                        topSlot={
                            applicationData.EL_PRTCL &&
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                }}>
                                    <IconButton
                                        onClick={() => window.open(applicationData.EL_PRTCL + workorder.number, '_blank', 'noopener noreferrer')}
                                        style={{ color: "#00aaff" }}>
                                        <OpenInNewIcon />
                                    </IconButton>
                                </div>
                        }/>
                )
                ,
                column: 2,
                order: 9
            },
            {
                id: 'CUSTOMFIELDS',
                label: 'Custom Fields',
                isVisibleWhenNewEntity: true,
                customVisibility: () => workOrderLayout.fields.block_5.attribute !== 'H',
                maximizable: false,
                render: () => 
                    <CustomFields
                        children={this.children}
                        entityCode='EVNT'
                        entityKeyCode={workorder.number}
                        classCode={workorder.classCode}
                        customFields={workorder.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)} />
                ,
                column: 2,
                order: 10
            },
            {
                id: 'CUSTOMFIELDSEQP',
                label: 'Custom Fields Equipment',
                isVisibleWhenNewEntity: true,
                customVisibility: () => WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', commonProps.workOrderLayout),
                maximizable: false,
                render: () => 
                    <CustomFields children={this.children}
                        entityCode='OBJ'
                        entityKeyCode={layout.woEquipment && layout.woEquipment.code}
                        classCode={layout.woEquipment && layout.woEquipment.classCode}
                        customFields={layout.woEquipment && layout.woEquipment.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        readonly={true} />
                ,
                column: 2,
                order: 11
            },
            {
                id: 'METERREADINGS',
                label: 'Meter Readings',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <MeterReadingContainerWO equipment={workorder.equipmentCode}/>
                ,
                column: 2,
                order: 12
            },
            {
                id: 'MULTIPLEEQUIPMENT',
                label: 'Equipment',
                isVisibleWhenNewEntity: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('MEC', commonProps.workOrderLayout),
                maximizable: false,
                render: () => 
                    <WorkorderMultiequipment workorder={workorder.number} />
                ,
                column: 2,
                order: 13
            },
        ]


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

    setWOEquipment = code => {
        //Only call if the region is available
        if (!WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', this.props.workOrderLayout)) {
            return;
        }

        return WSEquipment.getEquipment(code).then(response => {
            this.setLayout({woEquipment: response.body.data})
        }).catch(error => {
            this.setLayout({woEquipment: undefined})
        });
    };

    postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        this.checklists.readActivities(this.state.workorder.number);
    };

    renderWorkOrder() {
        const { layout, workorder } = this.state;
        const {
            applicationData,
            getUniqueRegionID,
            history,
            isHiddenRegion,
            toggleHiddenRegion,
            userData
        } = this.props;
        const regions = this.getRegions();
        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: "100%"}}>

                    <EamlightToolbar isModified={layout.isModified}
                                     newEntity={layout.newEntity}
                                     entityScreen={userData.screens[userData.workOrderScreen]}
                                     entityName="Work Order"
                                     entityKeyCode={workorder.number}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => history.push('/workorder')}
                                     deleteHandler={this.deleteEntity.bind(this, workorder.number)}
                                     width={790}
                                     toolbarProps={{
                                            _toolbarType: TOOLBARS.WORKORDER,
                                            workorder: workorder,
                                            postInit: this.postInit.bind(this),
                                            setLayout: this.setLayout.bind(this),
                                            newWorkorder: layout.newEntity,
                                            applicationData: applicationData,
                                            userGroup: userData.eamAccount.userGroup,
                                            screencode: userData.screens[userData.workOrderScreen].screenCode,
                                            copyHandler: this.copyEntity.bind(this)}
                                     }
                                     entityIcon={<WorkorderIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={toggleHiddenRegion}
                                     regions={regions}
                                     getUniqueRegionID={getUniqueRegionID}
                                     isHiddenRegion={isHiddenRegion}>
                    </EamlightToolbar>
                    <EntityRegions
                        regions={regions}
                        isNewEntity={layout.newEntity} 
                        isHiddenRegion={this.props.isHiddenRegion} />
                </BlockUi>
            </div>
        )
    }
}

export default Workorder;
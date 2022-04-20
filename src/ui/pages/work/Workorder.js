import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import WS from '../../../tools/WS'
import {ENTITY_TYPE} from "../../components/Toolbar";
import CustomFields from '../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import NCRIframeContainer from "../../components/iframes/NCRIframeContainer";
import Entity from '../Entity';
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import Activities from './activities/Activities';
import AdditionalCostsContainer from "./additionalcosts/AdditionalCostsContainer";
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
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import WSParts from '../../../tools/WSParts';
import WSWorkorders from '../../../tools/WSWorkorders';



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
        this.setPriorityValues();
        this.props.setLayoutProperty('showEqpTreeButton', false);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
        this.setClosingCodes(prevState);
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
            standardWO: this.onChangeStandardWorkOrder,
            classCode: this.onChangeClass,
        }
    }


    getRegions = () => {
        const {
            applicationData,
            handleError,
            showError,
            showNotification,
            userData,
            workOrderLayout
        } = this.props;
        const { layout, workorder, equipmentMEC } = this.state;
        const {tabs} = workOrderLayout;

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
                order: 1,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
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
                order: 2,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
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
                order: 3,
                ignore: !getTabAvailability(tabs, TAB_CODES.CLOSING_CODES),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CLOSING_CODES)
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
                        tabLayout={commonProps.workOrderLayout.tabs.PAR}
                        equipmentMEC={equipmentMEC}
                        disabled={this.departmentalSecurity.readOnly} />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.PART_USAGE),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PART_USAGE)
            },
            {
                id: 'ADDITONALCOSTS',
                label: 'Additional Costs',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('ACO', commonProps.workOrderLayout),
                render: () =>
                    <AdditionalCostsContainer
                        workorder={workorder}
                        tabLayout={commonProps.workOrderLayout.tabs.ACO}
                        equipmentMEC={equipmentMEC}
                        disabled={this.departmentalSecurity.readOnly} />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.ADDITIONAL_COSTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.ADDITIONAL_COSTS)
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
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.CHILD_WO),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHILD_WO)
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
                order: 5,
                ignore: !isCernMode && !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS)
            },
            {
                id: 'NCRS',
                label: 'NCRs',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <NCRIframeContainer
                        objectType="J"
                        objectID={workorder.number}
                        mode='NCR'                        
                    />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 6,
                
                ignore: !isCernMode && !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS)
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
                        allowHtml={true}
                        disabled={this.departmentalSecurity.readOnly} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
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
                        postAddActivityHandler={this.postAddActivityHandler}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        updateCount={workorder.updateCount}
                        startDate={workorder.startDate}
                        disabled={this.departmentalSecurity.readOnly} />
                ,
                column: 2,
                order: 8,
                ignore: !getTabAvailability(tabs, TAB_CODES.ACTIVITIES) && !getTabAvailability(tabs, TAB_CODES.BOOK_LABOR),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.ACTIVITIES) || getTabInitialVisibility(tabs, TAB_CODES.BOOK_LABOR)
            },
            {
                id: 'CHECKLISTS',
                label: 'Checklists',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: ({panelQueryParams}) =>  (
                    <Checklists
                        workorder={workorder.number}
                        printingChecklistLinkToAIS={applicationData.EL_PRTCL}
                        maxExpandedChecklistItems={Math.abs(parseInt(applicationData.EL_MCHLS)) || 50}
                        getWoLink={wo => '/workorder/' + wo}
                        ref={checklists => this.checklists = checklists}
                        showSuccess={showNotification}
                        showError={showError}
                        handleError={handleError}
                        userCode={userData.eamAccount.userCode}
                        disabled={this.departmentalSecurity.readOnly}
                        hideFilledItems={panelQueryParams.hideFilledItems === 'true'}
                        activity={panelQueryParams.CHECKLISTSactivity}
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
                order: 9,
                ignore: !getTabAvailability(tabs, TAB_CODES.CHECKLIST),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHECKLIST)
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
                order: 10,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
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
                order: 11,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CUSTOMFIELDSPART',
                label: 'Custom Fields Part',
                isVisibleWhenNewEntity: true,
                customVisibility: () =>
                    WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_PART', commonProps.workOrderLayout),
                maximizable: false,
                render: () => (
                    <CustomFields
                        children={this.children}
                        entityCode="OBJ"
                        entityKeyCode={layout.woEquipment && layout.woEquipment.partCode}
                        classCode={layout.woEquipment && layout.woEquipment.classCode}
                        customFields={layout.woEquipment && layout.woEquipment.partCustomFields}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        readonly={true}
                    />
                ),
                column: 2,
                order: 12,
                ignore: !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
            },
            {
                id: 'METERREADINGS',
                label: 'Meter Readings',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <MeterReadingContainerWO equipment={workorder.equipmentCode} disabled={this.departmentalSecurity.readOnly} />
                ,
                column: 2,
                order: 12,
                ignore: !getTabAvailability(tabs, TAB_CODES.METER_READINGS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.METER_READINGS)
            },
            {
                id: 'MULTIPLEEQUIPMENT',
                label: 'Equipment',
                isVisibleWhenNewEntity: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('MEC', commonProps.workOrderLayout),
                maximizable: false,
                render: () =>
                    <WorkorderMultiequipment workorder={workorder.number} setEquipmentMEC={this.setEquipmentMEC.bind(this)}/>
                ,
                column: 2,
                order: 13,
                ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN)
            },
        ]


    }

    setEquipmentMEC(data) {
        this.setState({equipmentMEC: data})
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

    postUpdate(workorder) {
        this.props.updateMyWorkOrders(workorder)
        this.setStatuses(workorder.statusCode, workorder.typeCode, false)
        this.setTypes(workorder.statusCode, workorder.typeCode, false)

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            // If opening a terminated work order
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

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            // If opening a terminated work order
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        //Set work order equipment
        this.setWOEquipment(workorder.equipmentCode, true);
    }

    postCopy = () => {
        let fields = this.props.workOrderLayout.fields;
        isCernMode && this.updateEntityProperty("statusCode", fields.workorderstatus.defaultValue ? fields.workorderstatus.defaultValue : "R")
        isCernMode && this.updateEntityProperty("typeCode", fields.workordertype.defaultValue ? fields.workordertype.defaultValue : "CD")
        isCernMode && this.updateEntityProperty("completedDate", "");
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

    setPriorityValues() {
        WSWorkorder.getWorkOrderPriorities()
            .then(response => {
                this.setLayout({priorityValues: response.body.data})
            });
    }

    setWOEquipment = (code, initialLoad = false) => {
        const {
            showWarning,
        } = this.props;
        return Promise.all([
            WSEquipment.getEquipment(code),
            WSWorkorders.getWOEquipLinearDetails(code),
        ])
            .then((response) => {
                const isWarrantyActive = response[1].body.data?.ISWARRANTYACTIVE === 'true';
                //this.setLayout({ woEquipment: response[0].body.data });
                if (!initialLoad) {
                    if (isWarrantyActive) {
                        showWarning('This equipment is currently under warranty.');
                    }
                    this.setState(state => ({
                        workorder: {
                            ...state.workorder,
                            warranty: isWarrantyActive,
                        }
                    }));
                }
                return response[0].body.data.partCode ? WSParts.getPart(response[0].body.data.partCode) : null;
            })
            .then((part) => {
                if (part && part.body.data) {
                    this.setLayout({
                        woEquipment: {
                            ...this.state.layout.woEquipment,
                            partCustomFields: part.body.data.customField,
                        },
                    });
                }
            })
            .catch(() => {
                this.setLayout({ woEquipment: undefined });
            });
    }

    setClosingCodes = prevState => {
        const { workorder = {}, layout } = this.state;
        const { classCode, problemCode, failureCode, causeCode, equipmentCode } = workorder || {};
        const objClass = layout.woEquipment && layout.woEquipment.classCode;

        const { workorder: prevWorkorder = {}, layout: prevLayout } = prevState || {};
        const prevObjClass = prevLayout && prevLayout.woEquipment && prevLayout.woEquipment.classCode;

        if (layout.reading) {
            return;
        }

        const equalObjectProps = (a, b, propNames) => propNames.every(field => a[field] === b[field]);
        if (!equalObjectProps(prevWorkorder, workorder,
                ['problemCode', 'failureCode', 'causeCode', 'classCode', 'equipmentCode'])
                || prevObjClass !== objClass) {

            Promise.all([
                WSWorkorder.getWorkOrderProblemCodeValues(classCode, objClass, equipmentCode),
                WSWorkorder.getWorkOrderActionCodeValues(objClass, failureCode, problemCode, causeCode, equipmentCode),
                WSWorkorder.getWorkOrderCauseCodeValues(objClass, failureCode, problemCode, equipmentCode),
                WSWorkorder.getWorkOrderFailureCodeValues(objClass, problemCode, equipmentCode)
            ]).then(responses => {
                const [
                    problemCodeValues,
                    actionCodeValues,
                    causeCodeValues,
                    failureCodeValues
                ] = responses.map(response => response.body.data);

                this.setLayout({
                    problemCodeValues,
                    actionCodeValues,
                    causeCodeValues,
                    failureCodeValues
                });
            });
        }

    }

    postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        this.checklists && this.checklists.readActivities(this.state.workorder.number);
    };

    renderWorkOrder() {
        const { layout, workorder } = this.state;
        const {
            applicationData,
            getUniqueRegionID,
            history,
            isHiddenRegion,
            setRegionVisibility,
            getHiddenRegionState,
            toggleHiddenRegion,
            userData
        } = this.props;
        const regions = this.getRegions();
        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: "100%"}}>

                    <EamlightToolbarContainer isModified={layout.isModified}
                                     newEntity={layout.newEntity}
                                     entityScreen={userData.screens[userData.workOrderScreen]}
                                     entityName="Work Order"
                                     entityKeyCode={workorder.number}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => history.push('/workorder')}
                                     deleteHandler={this.deleteEntity.bind(this, workorder.number)}
                                     width={790}
                                     toolbarProps={{
                                        entity: workorder,
                                        postInit: this.postInit.bind(this),
                                        setLayout: this.setLayout.bind(this),
                                        newEntity: layout.newEntity,
                                        applicationData: applicationData,
                                        userGroup: userData.eamAccount.userGroup,
                                        screencode: userData.screens[userData.workOrderScreen].screenCode,
                                        copyHandler: this.copyEntity.bind(this),
                                        entityDesc: this.settings.entityDesc,
                                        entityType: ENTITY_TYPE.WORKORDER,
                                        departmentalSecurity: this.departmentalSecurity,
                                        screens: userData.screens,
                                        workorderScreencode: userData.workorderScreen
                                     }}
                                     entityIcon={<WorkorderIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={toggleHiddenRegion}
                                     regions={regions}
                                     getUniqueRegionID={getUniqueRegionID}
                                     getHiddenRegionState={getHiddenRegionState}
                                     isHiddenRegion={isHiddenRegion}
                                     departmentalSecurity={this.departmentalSecurity} />
                    <EntityRegions
                        regions={regions}
                        isNewEntity={layout.newEntity}
                        getUniqueRegionID={getUniqueRegionID}
                        getHiddenRegionState={getHiddenRegionState}
                        setRegionVisibility={setRegionVisibility}
                        isHiddenRegion={this.props.isHiddenRegion} />
                </BlockUi>
            </div>
        )
    }
}

export default Workorder;

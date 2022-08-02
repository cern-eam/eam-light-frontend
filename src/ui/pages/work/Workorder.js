import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import React, { useEffect, useState, useRef } from 'react';
import BlockUi from 'react-block-ui';
import { useSelector } from 'react-redux'; // TODO: keep?
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import WS from '../../../tools/WS'
import {ENTITY_TYPE} from "../../components/Toolbar";
import CustomFields from '../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import NCRIframeContainer from "../../components/iframes/NCRIframeContainer";
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
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import {assignValues, assignUserDefinedFields, assignCustomFieldFromCustomField, AssignmentType} from '../EntityTools';
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import WSParts from '../../../tools/WSParts';
import WSWorkorders from '../../../tools/WSWorkorders';
import useEntity from "hooks/useEntity";
import { updateMyWorkOrders } from '../../../actions/workorderActions' // TODO: keep?


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

const Workorder = () => {
    const [equipmentMEC, setEquipmentMEC] = useState();
    console.log('equipmentMEC', equipmentMEC);
    const checklists = useRef(null);
    const layout = useSelector(state => state.ui.layout); // TODO: should useEntity be returning this instead?

    // TODO: was in constructor, stay in useEffect or move to eg PostRead
    useEffect(() => {
        setLayoutProperty('showEqpTreeButton', false);
    }, [])

    // TODO:
    // const componentDidMount = () => {
    //     super.componentDidMount();
    // }

    // TODO:
    // const componentDidUpdate = (prevProps, prevState, snapshot) => {
    //     super.componentDidUpdate(prevProps, prevState, snapshot);
    // }

    // TODO: waiting for handlers implementation to refactor
    const onChangeStandardWorkOrder = standardWorkOrderCode => {
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

    // TODO: waiting for handlers implementation to refactor
    const onChangeEquipment = value => {
        console.log('change equipment', value)
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
            setWOEquipment(value) //Set the equipment work order
        ]).catch(error => {
            //Simply don't assign values
        });
    };

    const {screenLayout: workOrderLayout, entity: workorder, loading,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, updateEntityProperty: updateWorkorderProperty, handleError, showError, showNotification} = useEntity({
            WS: {
                create: WSWorkorder.createWorkOrder,
                read: WSWorkorder.getWorkOrder,
                update: WSWorkorder.updateWorkOrder,
                delete: WSWorkorder.deleteWorkOrder,
                new:  WSWorkorder.initWorkOrder.bind(null, "EVNT"), // TODO: again we have extra arguments. What to do?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
            },
            entityDesc: "Work Order",
            entityURL: "/workorder/",
            entityCodeProperty: "number",
            screenProperty: "workOrderScreen",
            layoutProperty: "workOrderLayout",
        });

    // TODO: keeping for context
    // settings = {
        // layoutPropertiesMap: WorkorderTools.layoutPropertiesMap,
        // handlerFunctions: {
        //     equipmentCode: this.onChangeEquipment,
        //     standardWO: this.onChangeStandardWorkOrder,
        //     classCode: this.onChangeClass,
        // }
    // }

    const getRegions = () => {
        const { tabs } = workOrderLayout;

        const commonProps = {
            workorder,
            newEntity,
            layout, // TODO: check which comps are using it
            workOrderLayout,
            userGroup: userData.eamAccount.userGroup,
            updateWorkorderProperty,
            // setWOEquipment: this.setWOEquipment // TODO: do we need to be passing this? It does not seem to be used in any child component
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
                        tabLayout={tabs.PAR}
                        equipmentMEC={equipmentMEC}
                        disabled={departmentalSecurity.readOnly} />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.PART_USAGE),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PART_USAGE)
            },
            {
                id: 'ADDITIONALCOSTS',
                label: 'Additional Costs',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('ACO', commonProps.workOrderLayout),
                render: () =>
                    <AdditionalCostsContainer
                        workorder={workorder}
                        tabLayout={tabs.ACO}
                        equipmentMEC={equipmentMEC}
                        disabled={departmentalSecurity.readOnly} />
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
                    detailsStyle: { padding: 0, minHeight: 150 }
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
                        ref={comments => commentsComponent.current = comments}
                        entityCode='EVNT'
                        entityKeyCode={!newEntity ? workorder.number : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true}
                        disabled={departmentalSecurity.readOnly} />
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
                        layout={tabs}
                        defaultEmployee={userData.eamAccount.employeeCode}
                        defaultEmployeeDesc={userData.eamAccount.employeeDesc}
                        postAddActivityHandler={postAddActivityHandler}
                        updateEntityProperty={updateWorkorderProperty}
                        updateCount={workorder.updateCount}
                        startDate={workorder.startDate}
                        disabled={departmentalSecurity.readOnly} />
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
                        ref={checklists}
                        showSuccess={showNotification}
                        showError={showError}
                        handleError={handleError}
                        userCode={userData.eamAccount.userCode}
                        disabled={departmentalSecurity.readOnly}
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
                                        style={{ color: "#00aaff" }}
                                        size="large">
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
                        entityCode='EVNT'
                        entityKeyCode={workorder.number}
                        classCode={workorder.classCode}
                        customFields={workorder.customField}
                        updateEntityProperty={updateWorkorderProperty} />
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
                    <CustomFields
                        entityCode='OBJ'
                        entityKeyCode={layout.woEquipment && layout.woEquipment.code}
                        classCode={layout.woEquipment && layout.woEquipment.classCode}
                        customFields={layout.woEquipment && layout.woEquipment.customField}
                        updateEntityProperty={updateWorkorderProperty}
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
                        entityCode="OBJ"
                        entityKeyCode={layout.woEquipment && layout.woEquipment.partCode}
                        classCode={layout.woEquipment && layout.woEquipment.classCode}
                        customFields={layout.woEquipment && layout.woEquipment.partCustomFields}
                        updateEntityProperty={updateWorkorderProperty}
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
                    <MeterReadingContainerWO equipment={workorder.equipmentCode} disabled={departmentalSecurity.readOnly} />
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
                    <WorkorderMultiequipment workorder={workorder.number} setEquipmentMEC={setEquipmentMEC}/>
                ,
                column: 2,
                order: 13,
                ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN)
            },
        ];


    }

    //
    // CALLBACKS FOR ENTITY CLASS
    //
    const postInit = () => {
        // setStatuses('', '', true) // TODO: confirm it works as expected
        // setTypes('', '', true, false) // TODO: should be fine to rm
        // this.enableChildren() // TODO: keep for context
    }

    const postCreate = () => {
        // setStatuses(workorder.statusCode, workorder.typeCode, false); // TODO: confirm it works as expected
        // setTypes(this.state.workorder.statusCode, this.state.workorder.typeCode, false); // TODO: should be fine to rm
        // Comments panel might be hidden
        if (commentsComponent.current) {
            commentsComponent.current.createCommentForNewEntity();
        }
    }

    const postUpdate = (workorder) => {
        updateMyWorkOrders(workorder); // TODO: confirm we want to be calling it from the import
        // setStatuses(workorder.statusCode, workorder.typeCode, false); // TODO: confirm it works as expected
        // setTypes(workorder.statusCode, workorder.typeCode, false) // TODO: should be fine to rm

        if (departmentalSecurity.readOnly) {
            // this.disableChildren();  // TODO: keep for context
        } else if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            // If opening a terminated work order
            // this.disableChildren()  // TODO: keep for context
            // this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()  // TODO: keep for context
        } else {
            // this.enableChildren() // TODO: keep for context
        }
        // Comments panel might be hidden
        if (commentsComponent.current) {
            commentsComponent.current.createCommentForNewEntity();
        }
    }

    // TODO:
    const postRead = (workorder) => {
        updateMyWorkOrders(workorder); // TODO: confirm we want to be calling it from the import
        // setStatuses(workorder.statusCode, workorder.typeCode, false); // TODO: confirm it works as expected
        // setTypes(workorder.statusCode, workorder.typeCode, false) // TODO: should be fine to rm

        if (departmentalSecurity(workorder.departmentCode).readOnly) {
            console.log('disabling children') // TODO: rm
            // this.disableChildren(); // TODO: keep for context
        } else if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            // If opening a terminated work order
            // this.disableChildren()  // TODO: keep for context
            // this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()  // TODO: keep for context
        } else {
            // this.enableChildren()  // TODO: keep for context
            console.log('children enabled') // TODO: rm
        }
        //Set work order equipment
        setWOEquipment(workorder.equipmentCode, true);
    }

    const postCopy = () => {
        let fields = workOrderLayout.fields;
        isCernMode && updateWorkorderProperty("statusCode", fields.workorderstatus.defaultValue ? fields.workorderstatus.defaultValue : "R")
        isCernMode && updateWorkorderProperty("typeCode", fields.workordertype.defaultValue ? fields.workordertype.defaultValue : "CD")
        isCernMode && updateWorkorderProperty("completedDate", "");
    }

    //
    // DROP DOWN VALUES
    //
    // TODO: rm or not depending on setStatuses final logic
    // const setStatuses = (status, type, newwo) => {
    //     WSWorkorder.getWorkOrderStatusValues(this.props.userData.eamAccount.userGroup, status, type, newwo)
    //         .then(response => {
    //             this.setLayout({statusValues: response.body.data})
    //         })
    // }

    // TODO: should be fine to rm and keep it in inputs, since function args are not used and WS call only relies on fixed userGroup
    // const setTypes = (status, type, newwo, ppmwo) => {
    //     WSWorkorder.getWorkOrderTypeValues(this.props.userData.eamAccount.userGroup)
    //         .then(response => {
    //             this.setLayout({typeValues: response.body.data})
    //         })
    // }

    // TODO: waiting for handler and postRead to refactor and test
    const setWOEquipment = (code, initialLoad = false) => {
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

    // TODO: check if working
    const postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        checklists.current && checklists.current.readActivities(workorder.number);
    };

    if (!workorder) {
        return React.Fragment;
    }

    return (
        <div className="entityContainer">
            <BlockUi tag="div" blocking={loading} style={{height: "100%", width: "100%"}}>
                <EamlightToolbarContainer
                    isModified={true} // TODO:
                    newEntity={newEntity}
                    entityScreen={screenPermissions}
                    entityName="Work Order"
                    entityKeyCode={workorder.number}
                    saveHandler={saveHandler}
                    newHandler={newHandler}
                    deleteHandler={deleteHandler}
                    width={790}
                    toolbarProps={{
                        entity: workorder,
                        // postInit: this.postInit.bind(this),
                        // setLayout: this.setLayout.bind(this),
                        newEntity: newEntity,
                        applicationData: applicationData,
                        userGroup: userData.eamAccount.userGroup,
                        screencode: screenCode,
                        // copyHandler: this.copyEntity.bind(this),
                        entityDesc: "Work Order",
                        entityType: ENTITY_TYPE.WORKORDER,
                        departmentalSecurity: departmentalSecurity,
                        screens: userData.screens,
                        workorderScreencode: userData.workOrderScreen
                    }}
                    entityIcon={<WorkorderIcon style={{height: 18}}/>}
                    toggleHiddenRegion={toggleHiddenRegion}
                    regions={getRegions()}
                    getUniqueRegionID={getUniqueRegionID}
                    getHiddenRegionState={getHiddenRegionState}
                    isHiddenRegion={isHiddenRegion}
                    departmentalSecurity={departmentalSecurity} />
                <EntityRegions
                    regions={getRegions()}
                    isNewEntity={newEntity}
                    getUniqueRegionID={getUniqueRegionID}
                    getHiddenRegionState={getHiddenRegionState}
                    setRegionVisibility={setRegionVisibility}
                    isHiddenRegion={isHiddenRegion} />
            </BlockUi>
        </div>
    )
}

export default Workorder;

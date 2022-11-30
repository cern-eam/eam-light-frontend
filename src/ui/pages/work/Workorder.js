import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import React, { useEffect, useState, useRef } from 'react';
import BlockUi from 'react-block-ui';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
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
import WorkorderGeneral from './WorkorderGeneral';
import WorkorderScheduling from './WorkorderScheduling';
import { assignStandardWorkOrderValues, isClosedWorkOrder, isRegionAvailable, layoutPropertiesMap } from "./WorkorderTools";
import EntityRegions from '../../components/entityregions/EntityRegions';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility, registerCustomField } from '../EntityTools';
import WSParts from '../../../tools/WSParts';
import WSWorkorders from '../../../tools/WSWorkorders';
import useEntity from "hooks/useEntity";
import { updateMyWorkOrders } from '../../../actions/workorderActions' 
import { useDispatch } from 'react-redux';
import UserDefinedFields from 'ui/components/userdefinedfields/UserDefinedFields';
import { isHidden } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';


import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ConstructionIcon from '@mui/icons-material/Construction';
import SpeedIcon from '@mui/icons-material/Speed';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'; 
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import { PendingActions } from '@mui/icons-material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { PartIcon } from 'eam-components/dist/ui/components/icons';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import HardwareIcon from '@mui/icons-material/Hardware';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { Typography } from '@mui/material';

const Workorder = () => {
    const [equipmentMEC, setEquipmentMEC] = useState();
    const [equipment, setEquipment] = useState();
    const [equipmentPart, setEquipmentPart] = useState();
    const [statuses, setStatuses] = useState([]);
    const [otherIdMapping, setOtherIdMapping] = useState({})
    const checklists = useRef(null);
    const dispatch = useDispatch();
    const updateMyWorkOrdersConst = (...args) => dispatch(updateMyWorkOrders(...args));
    //
    //
    //
    const {screenLayout: workOrderLayout, entity: workorder, setEntity: setWorkOrder, loading, readOnly, isModified,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID,
        toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, copyHandler, updateEntityProperty: updateWorkorderProperty, register,
        handleError, showError, showNotification, showWarning} = useEntity({
            WS: {
                create: WSWorkorder.createWorkOrder,
                read: WSWorkorder.getWorkOrder,
                update: WSWorkorder.updateWorkOrder,
                delete: WSWorkorder.deleteWorkOrder,
                new:  WSWorkorder.initWorkOrder, 
            },
            postActions: {
                read: postRead,
                new: postInit,
                copy: postCopy
            },
            handlers: {
                standardWO: onChangeStandardWorkOrder,
                equipmentCode: onChangeEquipment
            },
            isReadOnlyCustomHandler: isClosedWorkOrder,
            entityCode: "EVNT",
            entityDesc: "Work Order",
            entityURL: "/workorder/",
            entityCodeProperty: "number",
            screenProperty: "workOrderScreen",
            layoutProperty: "workOrderLayout",
            layoutPropertiesMap,
            onMountHandler: mountHandler,
            onUnmountHandler: unmountHandler
    });

    //
    //
    //

    useEffect( () => {
        setEquipment(null);
        setEquipmentPart(null);
        
        if (!workorder?.equipmentCode) {
            return;
        }

        WSEquipment.getEquipment(workorder.equipmentCode)
        .then(response => {
            const equipmentResponse = response.body.data;
            setEquipment(equipmentResponse);
            if (equipmentResponse.partCode) {
                WSParts.getPart(equipmentResponse.partCode)
                .then(response => setEquipmentPart(response.body.data))
                .catch(console.error);
            }
        })
        .catch(console.error);
           
    }, [workorder?.equipmentCode])

    //
    //
    //
    function onChangeEquipment(equipmentCode) {
        if(!equipmentCode) {
            return;
        }

        Promise.all([
            WSEquipment.getEquipment(equipmentCode),
            WSWorkorders.getWOEquipLinearDetails(equipmentCode),
        ]).then( response => {
            const equipment = response[0].body.data;
            const linearDetails = response[1].body.data;

            setWorkOrder(oldWorkOrder => ({
                ...oldWorkOrder,
                departmentCode: equipment.departmentCode,
                departmentDesc: equipment.departmentDesc,
                locationCode: equipment.hierarchyLocationCode,
                locationDesc: equipment.hierarchyLocationDesc,
                costCode: equipment.costCode,
                costCodeDesc: equipment.costCodeDesc,
                warranty: linearDetails.ISWARRANTYACTIVE
            }))

            if (linearDetails.ISWARRANTYACTIVE === 'true') {
                showWarning('This equipment is currently under warranty.');
            }
        })
        .catch(console.error);

    };

    function onChangeStandardWorkOrder(standardWorkOrderCode) {
        if (standardWorkOrderCode) {
            WSWorkorder.getStandardWorkOrder(standardWorkOrderCode)
            .then(response => setWorkOrder( oldWorkOrder => assignStandardWorkOrderValues(oldWorkOrder, response.body.data)))
            .catch(console.error);
        }
    }

    const getRegions = () => {
        const { tabs } = workOrderLayout;

        const commonProps = {
            workorder,
            newEntity,
            workOrderLayout,
            userGroup: userData.eamAccount.userGroup,
            updateWorkorderProperty,
            register
        };

        return [
            {
                id: 'DETAILS',
                label: 'Details',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <WorkorderGeneral
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} 
                        equipment={equipment}
                        statuses={statuses}
                        newEntity={newEntity}
                        screenCode={screenCode}
                        screenPermissions={screenPermissions}
                        setLayoutProperty={setLayoutProperty}/>
                ,
                column: 1,
                order: 1,
                summaryIcon: AssignmentIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'SCHEDULING',
                label: 'Scheduling',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => isRegionAvailable('SCHEDULING', commonProps.workOrderLayout),
                render: () =>
                    <WorkorderScheduling {...commonProps} />
                ,
                column: 1,
                order: 2,
                summaryIcon: CalendarMonthIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CLOSINGCODES',
                label: 'Closing Codes',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => isRegionAvailable('CLOSING_CODES', commonProps.workOrderLayout),
                render: () =>
                    <WorkorderClosingCodes {...commonProps} equipment={equipment} />
                ,
                column: 1,
                order: 3,
                summaryIcon: SportsScoreIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.CLOSING_CODES),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CLOSING_CODES)
            },
            {
                id: 'PARTUSAGE',
                label: 'Part Usage',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => isRegionAvailable('PAR', commonProps.workOrderLayout),
                render: () =>
                    <PartUsageContainer
                        workorder={workorder}
                        tabLayout={tabs.PAR}
                        equipmentMEC={equipmentMEC}
                        disabled={readOnly} />
                ,
                column: 1,
                order: 4,
                summaryIcon: PartIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.PART_USAGE),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PART_USAGE)
            },
            {
                id: 'ADDITIONALCOSTS',
                label: 'Additional Costs',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => isRegionAvailable('ACO', commonProps.workOrderLayout),
                render: () =>
                    <AdditionalCostsContainer
                        workorder={workorder}
                        tabLayout={tabs.ACO}
                        equipmentMEC={equipmentMEC}
                        disabled={readOnly} />
                ,
                column: 1,
                order: 4,
                summaryIcon: MonetizationOnRoundedIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.ADDITIONAL_COSTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.ADDITIONAL_COSTS)
            },
            {
                id: 'CHILDRENWOS',
                label: 'Child Work Orders',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => isRegionAvailable('CWO', commonProps.workOrderLayout),
                render: () => <WorkorderChildren workorder={workorder.number} />,
                column: 1,
                order: 4,
                summaryIcon: SegmentRoundedIcon,
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
                summaryIcon: FunctionsRoundedIcon,
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
                summaryIcon: BookmarkBorderRoundedIcon,
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
                        //entityOrganization={workorder.organization}
                        disabled={readOnly} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                summaryIcon: DriveFileRenameOutlineIcon,
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
                        disabled={readOnly}
                        handleError={handleError}
                    />
                ,
                column: 2,
                order: 8,
                summaryIcon: PendingActions,
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
                        eqpToOtherId={otherIdMapping}
                        printingChecklistLinkToAIS={applicationData.EL_PRTCL}
                        maxExpandedChecklistItems={Math.abs(parseInt(applicationData.EL_MCHLS)) || 50}
                        getWoLink={wo => '/workorder/' + wo}
                        ref={checklists}
                        showSuccess={showNotification}
                        showError={showError}
                        handleError={handleError}
                        userCode={userData.eamAccount.userCode}
                        disabled={readOnly}
                        hideFollowUpProp={isHidden(
                            commonProps.workOrderLayout.tabs.ACK.fields.createfollowupwo
                        )}
                        hideFilledItems={panelQueryParams.CHECKLISTShideFilledItems === 'true'}
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
                                        <OpenInNewIcon style={{ padding: "9px" }} />
                                         <Typography>Results</Typography>
                                    </IconButton>
                                </div>
                        }/>
                )
                ,
                column: 2,
                order: 9,
                summaryIcon: PlaylistAddCheckIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.CHECKLIST),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHECKLIST)
            },
            {
                id: 'CUSTOMFIELDS',
                label: 'Custom Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <CustomFields
                        entityCode='EVNT'
                        entityKeyCode={workorder.number}
                        classCode={workorder.classCode}
                        customFields={workorder.customField}
                        register={register} />
                ,
                column: 2,
                order: 10,
                summaryIcon: ListAltIcon,
                ignore: workOrderLayout.fields.block_5.attribute === 'H',
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CUSTOMFIELDSEQP',
                label: 'Custom Fields Equipment',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <CustomFields
                        entityCode='OBJ'
                        entityKeyCode={equipment?.code}
                        classCode={equipment?.classCode}
                        customFields={equipment?.customField}
                        register={registerCustomField(equipment)}/>
                ,
                column: 2,
                order: 11,
                summaryIcon: ConstructionIcon,
                ignore: !isRegionAvailable('CUSTOM_FIELDS_EQP', commonProps.workOrderLayout),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CUSTOMFIELDSPART',
                label: 'Custom Fields Part',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => (
                    <CustomFields
                        entityCode="PART"
                        entityKeyCode={equipmentPart?.Code}
                        classCode={equipmentPart?.classCode}
                        customFields={equipmentPart?.customField}
                        register={registerCustomField(equipmentPart)}/>
                ),
                column: 2,
                order: 12,
                summaryIcon: HardwareIcon,
                ignore: !isRegionAvailable('CUSTOM_FIELDS_PART', commonProps.workOrderLayout),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED),
            },
            {
                id: 'METERREADINGS',
                label: 'Meter Readings',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <MeterReadingContainerWO equipment={workorder.equipmentCode} disabled={readOnly} />
                ,
                column: 2,
                order: 12,
                summaryIcon: SpeedIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.METER_READINGS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.METER_READINGS)
            },
            {
                id: 'MULTIPLEEQUIPMENT',
                label: 'Equipment',
                isVisibleWhenNewEntity: false,
                customVisibility: () => isRegionAvailable('MEC', commonProps.workOrderLayout),
                maximizable: false,
                render: () =>
                    <WorkorderMultiequipment workorder={workorder.number} setEquipmentMEC={setEquipmentMEC}/>
                ,
                column: 2,
                order: 13,
                summaryIcon: PrecisionManufacturingIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN)
            },
            {
                id: 'USERDEFINEDFIELDS',
                label: 'User Defined Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <UserDefinedFields
                        {...commonProps}
                        entityLayout={workOrderLayout.fields}
                    />
                ,
                column: 2,
                order: 10,
                summaryIcon: AssignmentIndIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
        ];
    }

    //
    // CALLBACKS FOR ENTITY CLASS
    //
    function postInit() {
        readStatuses('', '', true);
    }

    function postRead(workorder) {
        setLayoutProperty('equipment', {code: workorder.equipmentCode, organization: workorder.equipmentOrganization});
        updateMyWorkOrdersConst(workorder); 
        readStatuses(workorder.statusCode, workorder.typeCode, false); 
        readOtherIdMapping(workorder.number);
    }

    function postCopy() {
        readStatuses('', '', true);
        let fields = workOrderLayout.fields;
        isCernMode && updateWorkorderProperty("statusCode", fields.workorderstatus.defaultValue ? fields.workorderstatus.defaultValue : "R")
        isCernMode && updateWorkorderProperty("typeCode", fields.workordertype.defaultValue ? fields.workordertype.defaultValue : "CD")
        isCernMode && updateWorkorderProperty("completedDate", "");
    }

    //
    // DROP DOWN VALUES
    //
    const readStatuses = (status, type, newwo) => {
        WSWorkorder.getWorkOrderStatusValues(userData.eamAccount.userGroup, status, type, newwo)
            .then(response => setStatuses(response.body.data))
            .catch(console.error);
    }

    const postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        checklists.current && checklists.current.readActivities(workorder.number);
    };

    const readOtherIdMapping = (number) => {
        WSWorkorder.getWOEquipToOtherIdMapping(number)
            .then(response => setOtherIdMapping(response.body.data))
            .catch(error => console.error('readOtherIdMapping', error))
    }

    function mountHandler() {
        setLayoutProperty('eqpTreeMenu', [{
            desc: "Use for this Work Order",
            icon: <ContentPasteIcon/>,
            handler: (rowInfo) => {
                updateWorkorderProperty('equipmentCode', rowInfo.node.id)
                updateWorkorderProperty('equipmentDesc', rowInfo.node.name)
            }
        }])
    }

    function unmountHandler() {
        setLayoutProperty('eqpTreeMenu', null);
    }

    if (!workorder) {
        return React.Fragment;
    }

    return (
        <div className="entityContainer">
            <BlockUi tag="div" blocking={loading} style={{height: "100%", width: "100%"}}>
                <EamlightToolbarContainer
                    isModified={isModified}
                    newEntity={newEntity}
                    entityScreen={screenPermissions}
                    entityName="Work Order"
                    entityKeyCode={workorder.number}
                    organization={workorder.organization}
                    saveHandler={saveHandler}
                    newHandler={newHandler}
                    deleteHandler={deleteHandler}
                    width={790}
                    toolbarProps={{
                        entity: workorder,
                        // postInit: this.postInit.bind(this),
                        // setLayout: this.setLayout.bind(this),
                        newEntity,
                        applicationData: applicationData,
                        userGroup: userData.eamAccount.userGroup,
                        screencode: screenCode,
                        copyHandler: copyHandler,
                        entityDesc: "Work Order",
                        entityType: ENTITY_TYPE.WORKORDER,
                        screens: userData.screens,
                        workorderScreencode: userData.workOrderScreen
                    }}
                    entityIcon={<ContentPasteIcon style={{height: 18}}/>}
                    toggleHiddenRegion={toggleHiddenRegion}
                    regions={getRegions()}
                    getUniqueRegionID={getUniqueRegionID}
                    getHiddenRegionState={getHiddenRegionState}
                    isHiddenRegion={isHiddenRegion} />
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

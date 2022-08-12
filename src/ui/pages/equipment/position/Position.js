import React, { useState } from 'react';
import queryString from "query-string";
import EquipmentHistory from '../components/EquipmentHistory.js'
import EamlightToolbarContainer from './../../../components/EamlightToolbarContainer'
import CustomFields from '../../../components/customfields/CustomFields'
import WSEquipment from "../../../../tools/WSEquipment"
import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'
import PositionGeneral from './PositionGeneral'
import PositionDetails from './PositionDetails'
import PositionHierarchy from './PositionHierarchy'
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentPartsAssociated from "../components/EquipmentPartsAssociated";
import {PositionIcon} from 'eam-components/dist/ui/components/icons'
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import {ENTITY_TYPE} from "../../../components/Toolbar";
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentGraphIframe from '../../../components/iframes/EquipmentGraphIframe';
import { isCernMode } from '../../../components/CERNMode';
import { TAB_CODES } from '../../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../../EntityTools';
import NCRIframeContainer from '../../../components/iframes/NCRIframeContainer';
import useEntity from "hooks/useEntity";

const Position = () => {
    const [statuses, setStatuses] = useState([]);

    const {screenLayout: positionLayout, entity: equipment, loading, readOnly,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, copyHandler, updateEntityProperty: updateEquipmentProperty, register, 
        handleError, showError, showNotification, showWarning} = useEntity({
            WS: {
                create: WSEquipment.createEquipment,
                read: WSEquipment.getEquipment,
                update: WSEquipment.updateEquipment,
                delete: WSEquipment.deleteEquipment,
                new:  WSEquipment.initEquipment.bind(null, "OBJ", "P"), // TODO: again we have extra arguments. What to do?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
                update: postUpdate
            },
            entityCode: "OBJ",
            entityDesc: "Position",
            entityURL: "/position/",
            entityCodeProperty: "code",
            screenProperty: "positionScreen",
            layoutProperty: "positionLayout",
        });

        function postInit() {
            readStatuses(true); 
            setLayoutProperty('showEqpTreeButton', false)
        }
    
        function postCreate() {
            readStatuses(false, equipment.statusCode); 
            commentsComponent.current?.createCommentForNewEntity();
            setLayoutProperty('showEqpTreeButton', true)
        }
    
        function postUpdate() {
            readStatuses(false, equipment.statusCode) 
            commentsComponent.current?.createCommentForNewEntity();
        }
    
        function postRead(equipment) {
            readStatuses(false, equipment.statusCode) 
            setLayoutProperty('showEqpTreeButton', true)
            setLayoutProperty('equipment', equipment);
        }
    
        const readStatuses = (neweqp, statusCode) => {
            WSEquipment.getEquipmentStatusValues(userData.eamAccount.userGroup, neweqp, statusCode)
                .then(response => setStatuses(response.body.data))
                .catch(console.error)
        }

    const getRegions = () => {
        const tabs = positionLayout.tabs;

        const commonProps = {
            equipment,
            newEntity,
            positionLayout,
            userGroup: userData.eamAccount.userGroup,
            updateEquipmentProperty,
            register,
            showWarning,
        }
        
        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <PositionGeneral
                        showNotification={showNotification}
                        {...commonProps}
                        statuses={statuses}
                        userData={userData}
                        screenPermissions={screenPermissions}/>
                ,
                column: 1,
                order: 1,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'DETAILS',
                label: 'Details',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <PositionDetails
                        {...commonProps} />
                ,
                column: 1,
                order: 2,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'HIERARCHY',
                label: 'Hierarchy',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <PositionHierarchy
                        {...commonProps} />
                ,
                column: 1,
                order: 3,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'WORKORDERS',
                label: 'Work Orders',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: ({ panelQueryParams }) => 
                    <EquipmentWorkOrders
                        equipmentcode={equipment.code}
                        defaultFilter={panelQueryParams.defaultFilter}
                        equipmenttype='P' />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS)
            },
            {
                id: 'HISTORY',
                label: 'History',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                render: () => 
                    <EquipmentHistory
                        equipmentcode={equipment.code} />
                ,
                column: 1,
                order: 5,
                ignore: !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS)
            },
            {
                id: 'PARTS',
                label: 'Parts',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                render: () => 
                    <EquipmentPartsAssociated
                        equipmentcode={equipment.code}
                        parentScreen={userData.screens[userData.positionScreen].parentScreen} />
                ,
                column: 1,
                order: 6,
                ignore: !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED)
            },
            {
                id: 'EDMSDOCUMENTS',
                label: 'EDMS Documents',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EDMSDoclightIframeContainer
                        objectType="S"
                        objectID={equipment.code} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS)
            },
            {
                id: 'NCRS',
                label: 'NCRs',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => <NCRIframeContainer 
                    objectType="S"
                    objectID={equipment.code}  
                />,
                RegionPanelProps: {
                    detailsStyle: { padding: 0, minHeight: 150 }
                },
                column: 2,
                order: 8,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_POSITIONS)
            },
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <Comments
                        ref={comments => commentsComponent.current = comments}
                        entityCode='OBJ'
                        entityKeyCode={!newEntity ? equipment.code : undefined}
                        userCode={userData.eamAccount.userCode}
                        allowHtml={true}
                        disabled={departmentalSecurity.readOnly} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 9,
                ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
            },
            {
                id: 'USERDEFINEDFIELDS',
                label: 'User Defined Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <UserDefinedFields
                        entityLayout={positionLayout.fields}
                        {...commonProps}
                    />
                ,
                column: 2,
                order: 10,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CUSTOMFIELDS',
                label: 'Custom Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <CustomFields
                        entityCode='OBJ'
                        entityKeyCode={equipment.code}
                        classCode={equipment.classCode}
                        customFields={equipment.customField}
                        updateEntityProperty={updateEquipmentProperty}
                        readonly={readOnly}
                    />
                ,
                column: 2,
                order: 11,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'EQUIPMENTGRAPH',
                label: 'Equipment Graph',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EquipmentGraphIframe
                        equipmentCode={equipment.code} 
                        equipmentGraphURL={applicationData.EL_EQGRH}
                    />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 12,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_POSITIONS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_GRAPH_POSITIONS)
            },
        ]
    }

    if (!equipment) {
        return React.Fragment;
    }

    return (
        <BlockUi tag="div" blocking={loading} style={{width: '100%', height: "100%"}}>
            <EamlightToolbarContainer
                isModified={true} // TODO:
                newEntity={newEntity}
                entityScreen={screenPermissions}
                entityName="Position"
                entityKeyCode={equipment.code}
                saveHandler={saveHandler}
                newHandler={newHandler}
                deleteHandler={deleteHandler}
                toolbarProps={{
                    entityDesc: "Position",
                    entity: equipment,
                    // postInit: this.postInit.bind(this),
                    // setLayout: this.setLayout.bind(this),
                    newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_POSLI,
                    screencode: screenCode,
                    copyHandler,
                    entityType: ENTITY_TYPE.EQUIPMENT,
                    departmentalSecurity: departmentalSecurity,
                    screens: userData.screens,
                    workorderScreencode: userData.workOrderScreen
                }}
                width={730}
                entityIcon={<PositionIcon style={{height: 18}}/>}
                toggleHiddenRegion={toggleHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                regions={getRegions()}
                getHiddenRegionState={getHiddenRegionState}
                isHiddenRegion={isHiddenRegion}
                departmentalSecurity={departmentalSecurity} />
            <EntityRegions
                showEqpTree={showEqpTree}
                regions={getRegions()}
                isNewEntity={newEntity} 
                getUniqueRegionID={getUniqueRegionID}
                getHiddenRegionState={getHiddenRegionState}
                setRegionVisibility={setRegionVisibility}
                isHiddenRegion={isHiddenRegion}/>
        </BlockUi>
    )
}

export default Position;

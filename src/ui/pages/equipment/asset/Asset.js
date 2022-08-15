import Comments from 'eam-components/dist/ui/components/comments/Comments';
import { AssetIcon } from 'eam-components/dist/ui/components/icons';
import React, { useEffect, useState }  from 'react';
import queryString from 'query-string';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import WSEquipment from "../../../../tools/WSEquipment";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import CustomFields from '../../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentHistory from '../components/EquipmentHistory.js';
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EamlightToolbarContainer from './../../../components/EamlightToolbarContainer';
import AssetDetails from './AssetDetails';
import AssetGeneral from './AssetGeneral';
import AssetHierarchy from './AssetHierarchy';
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentPartsMadeOf from "../components/EquipmentPartsMadeOf";
import WSParts from '../../../../tools/WSParts';
import EquipmentGraphIframe from '../../../components/iframes/EquipmentGraphIframe';
import { isCernMode } from '../../../components/CERNMode';
import { TAB_CODES } from '../../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../../EntityTools';
import NCRIframeContainer from '../../../components/iframes/NCRIframeContainer';
import useEntity from "hooks/useEntity";
import { isClosedEquipment } from '../EquipmentTools';

const Asset = () => {
    const [part, setPart] = useState(part);
    const [statuses, setStatuses] = useState([]);

    // const queryParams = queryString.parse(window.location.search).length > 0 ?
    //                     queryString.parse(window.location.search) : '';

    const {screenLayout: assetLayout, entity: equipment, loading, readOnly,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, copyHandler, updateEntityProperty: updateEquipmentProperty, register, 
        handleError, showError, showNotification, showWarning} = useEntity({
            WS: {
                create: WSEquipment.createEquipment,
                read: WSEquipment.getEquipment,
                update: WSEquipment.updateEquipment,
                delete: WSEquipment.deleteEquipment,
                new:  WSEquipment.initEquipment.bind(null, "OBJ", "A"), // TODO: again we have extra arguments. What to do?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
                update: postUpdate
            },
            isReadOnlyCustomHandler: isClosedEquipment,
            entityCode: "OBJ",
            entityDesc: "Asset",
            entityURL: "/asset/",
            entityCodeProperty: "code",
            screenProperty: "assetScreen",
            layoutProperty: "assetLayout",
            // layoutPropertiesMap: EquipmentTools.assetLayoutPropertiesMap, // TODO: 
        });

    useEffect(() => {
        // Part input is cleared
        if (equipment?.partCode === '') {
            setPart(undefined);
        }
        // Part input is filled
        if (equipment?.partCode) {
            WSParts.getPart(equipment.partCode).then(response => {
                setPart(response.body.data);
            }).catch(error => {
                setPart(undefined);
            });
        }
    }, [equipment?.partCode]);

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
        const tabs = assetLayout.tabs;

        const commonProps = {
            equipment,
            newEntity,
            assetLayout,
            updateEquipmentProperty,
            register,
            userGroup: userData.eamAccount.userGroup,
            showWarning
        }

        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <AssetGeneral
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
                    <AssetDetails
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
                    <AssetHierarchy
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
                        equipmenttype='A' />
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
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'PARTS',
                label: 'Parts',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => <EquipmentPartsMadeOf equipmentcode={equipment.code} />,
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
                        objectType="A"
                        objectID={equipment.code} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS)
            },
            {
                id: 'NCRS',
                label: 'NCRs',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => <NCRIframeContainer 
                    objectType="A"
                    objectID={equipment.code}  
                />,
                RegionPanelProps: {
                    detailsStyle: { padding: 0, minHeight: 150 }
                },
                column: 2,
                order: 8,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_ASSETS)
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
                        disabled={readOnly} />
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
                        {...commonProps}
                        entityLayout={assetLayout.fields}
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
                        readonly={readOnly} />
                ,
                column: 2,
                order: 11,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id : 'PARTCUSTOMFIELDS',
                label : 'Part Custom Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => part,
                render: () => {
                    return <CustomFields 
                        entityCode='PART'
                        entityKeyCode={part?.code}
                        classCode={part?.classCode}
                        customFields={part?.customField}
                        updateEntityProperty={updateEquipmentProperty}
                        readonly={true}/>
                },
                column: 2,
                order: 12,
                ignore: !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PARTS_ASSOCIATED)
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
                order: 13,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_ASSETS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_GRAPH_ASSETS)
            },
        ]
    }

    if (!equipment) {
        return React.Fragment;
    }

    return (
        <BlockUi tag="div" blocking={loading} style={{ height: "100%", width: "100%" }}>
            <EamlightToolbarContainer
                isModified={true} // TODO:
                newEntity={newEntity}
                entityScreen={screenPermissions}
                entityName="Asset" // TODO:
                entityKeyCode={equipment.code}
                saveHandler={saveHandler}
                newHandler={newHandler}
                deleteHandler={deleteHandler}
                toolbarProps={{
                    entityDesc: "Asset", // TODO:
                    entity: equipment,
                    // postInit: this.postInit.bind(this),
                    // setLayout: this.setLayout.bind(this),
                    newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_ASSLI,
                    screencode: screenCode,
                    copyHandler,
                    entityType: ENTITY_TYPE.EQUIPMENT,
                    screens: screenPermissions,
                    workorderScreencode: userData.workOrderScreen
                }}
                width={730}
                entityIcon={<AssetIcon style={{ height: 18 }} />}
                toggleHiddenRegion={toggleHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                regions={getRegions()}
                isHiddenRegion={isHiddenRegion}
                getHiddenRegionState={getHiddenRegionState} />
            <EntityRegions
                showEqpTree={showEqpTree}
                regions={getRegions()}
                isNewEntity={newEntity} 
                isHiddenRegion={isHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                setRegionVisibility={setRegionVisibility}
                getHiddenRegionState={getHiddenRegionState}/>
        </BlockUi>
    )
}

export default Asset;

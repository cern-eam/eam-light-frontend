import Comments from 'eam-components/dist/ui/components/comments/Comments';
import { AssetIcon } from 'eam-components/dist/ui/components/icons';
import React, { useEffect, useState }  from 'react';
import { useSelector } from 'react-redux'; // TODO: rm
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

const Asset = () => {
    const [part, setPart] = useState(part); // TODO: confirm whole associated behavior of part custom fields

    const queryParams = queryString.parse(window.location.search).length > 0 ?
                        queryString.parse(window.location.search) : '';

    const {screenLayout: assetLayout, entity: equipment, loading,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, updateEntityProperty: updateEquipmentProperty, handleError, showError, showNotification} = useEntity({
            WS: {
                create: WSEquipment.createEquipment,
                read: WSEquipment.getEquipment,
                update: WSEquipment.updateEquipment,
                delete: WSEquipment.deleteEquipment,
                new:  WSEquipment.initEquipment.bind(null, "OBJ", "A", queryParams), // TODO: again we have extra arguments. What to do?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
            },
            entityCode: "OBJ",
            entityDesc: "Asset",
            entityURL: "/asset/",
            entityCodeProperty: "code",
            screenProperty: "assetScreen",
            layoutProperty: "assetLayout",
            // layoutPropertiesMap: EquipmentTools.assetLayoutPropertiesMap, // TODO: 
        });

    useEffect(() => {
        if (equipment?.partCode) {
            WSParts.getPart(equipment.partCode).then(response => {
                setPart(response.body.data);
            }).catch(error => {
                setPart(undefined);
                setLayoutProperty('partCustomField', undefined);
            });
        }
    }, [equipment?.partCode]);

    const postInit = () => {
        // this.setStatuses(true); // TODO: confirm it works as expected, oldStatusCode arg
        setLayoutProperty('showEqpTreeButton', false)
        // this.enableChildren(); // TODO: keeping for context
    }

    const postCreate = () => {
        // this.setStatuses(false); // TODO: confirm it works as expected, oldStatusCode arg
        commentsComponent.current.createCommentForNewEntity();
        setLayoutProperty('showEqpTreeButton', true)
    }

    const postUpdate = () => {
        commentsComponent.current.createCommentForNewEntity();
        // setAssetPart(equipment.partCode) // TODO: keep for context but I'd remove from here to useEffect

        if (departmentalSecurity.readOnly) {
            // this.disableChildren(); // TODO: keeping for context
        } else {
            // this.enableChildren(); // TODO: keeping for context
        }
    }

    const postRead = (equipment) => {
        // this.setStatuses(false, equipment.statusCode) // TODO: confirm it works as expected, , oldStatusCode arg
        setLayoutProperty('showEqpTreeButton', true)
        setLayoutProperty('equipment', equipment);
        // setAssetPart(equipment.partCode); // TODO: keep for context but I'd remove from here to useEffect

        if (departmentalSecurity.readOnly) {
            // this.disableChildren(); // TODO: keeping for context
        } else {
            // this.enableChildren(); // TODO: keeping for context
        }
    }

    // TODO: Tested it and looked ok, but may be better to discuss because argument is called 'oldStatusCode' and we are passing the current status code.
    // const setStatuses = (neweqp, oldStatusCode) => {
    // WSEquipment.getEquipmentStatusValues(this.props.userData.eamAccount.userGroup, neweqp, oldStatusCode)
    //         .then(response => {
    //             this.setLayout({ statusValues: response.body.data })
    //         })
    // }

    const preCreateEntity = (equipment) => {
        //Check hierarchy
        return setValuesHierarchy(equipment);
    }

    const preUpdateEntity = (equipment) => {
        //Check hierarchy
        return setValuesHierarchy(equipment);
    }

    const setValuesHierarchy = (equipment) => {
        //If there is parent asset
        if (equipment.hierarchyAssetCode) {
            equipment.hierarchyAssetDependent = !equipment.hierarchyAssetDependent ? 'true' : equipment.hierarchyAssetDependent;
            equipment.hierarchyAssetCostRollUp = !equipment.hierarchyAssetCostRollUp ? 'true' : equipment.hierarchyAssetCostRollUp;
        } else {
            equipment.hierarchyAssetDependent = 'false';
            equipment.hierarchyAssetCostRollUp = 'false';
        }

        //Position
        if (equipment.hierarchyPositionCode) {
            equipment.hierarchyPositionDependent = !equipment.hierarchyPositionDependent ? 'true' : equipment.hierarchyPositionDependent;
            equipment.hierarchyPositionCostRollUp = !equipment.hierarchyPositionCostRollUp ? 'true' : equipment.hierarchyPositionCostRollUp;
        } else {
            equipment.hierarchyPositionDependent = 'false';
            equipment.hierarchyPositionCostRollUp = 'false';
        }

        //If there is primary system
        if (equipment.hierarchyPrimarySystemCode) {
            equipment.hierarchyPrimarySystemDependent = !equipment.hierarchyPrimarySystemDependent ? 'true' : equipment.hierarchyPrimarySystemDependent;
            equipment.hierarchyPrimarySystemCostRollUp = !equipment.hierarchyPrimarySystemCostRollUp ? 'true' : equipment.hierarchyPrimarySystemCostRollUp;
        } else {
            equipment.hierarchyPrimarySystemDependent = 'false';
            equipment.hierarchyPrimarySystemCostRollUp = 'false';
        }
        return equipment;
    };


    const getRegions = () => {
        const tabs = assetLayout.tabs;

        const commonProps = {
            equipment,
            newEntity,
            assetLayout,
            updateEquipmentProperty,
            userGroup: userData.eamAccount.userGroup,
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
                        {...commonProps}/>
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
                        fields={equipment.userDefinedFields}
                        entityLayout={assetLayout.fields}
                        updateUDFProperty={updateEquipmentProperty}
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
                        updateEntityProperty={updateEquipmentProperty} />
                ,
                column: 2,
                order: 11,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            // TODO: figure out how we want to handle part state. We keep the useState?
            {
                id : 'PARTCUSTOMFIELDS',
                label : 'Part Custom Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => part, // TODO: visibility set by existence of part state, not by checkbox? Even if there is no part but checkbox to open part custom fields, the user would expect an empty panel, not no panel. That makes it seem like our app is not responding. Is it because we set undefined in the setPart if the WS call fails? Actually might just be for the assets that don't have a part associated (eg https://testeamlight.cern.ch/asset/CFXM-00241) but then shouldn't we instead disable the option of opening the Part Custom Fields panel? Also don't assets always have to have a part associated?
                render: () => {
                    return <CustomFields 
                        entityCode='PART'
                        entityKeyCode={part?.code}
                        classCode={part?.classCode}
                        customFields={part?.customField} // TODO: we rely on 'ui.layout' store state that we set in useEffect. Ok?
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

    // TODO: with the previous logic, this wouldn't run at all because the postXXX functions
    // are not being called. Either way, we are now using a useEffect hook to accomplish
    // the same. Ok?
    // const setAssetPart = partCode => {
    //     return WSParts.getPart(partCode).then(response => {
    //         setPart(response.body.data);
    //         setLayoutProperty('partCustomField', response.body.data.customField);
    //     }).catch(error => {
    //         setPart(undefined);
    //         setLayoutProperty('partCustomField', undefined);
    //     });
    // };

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
                    newEntity: newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_ASSLI,
                    screencode: screenCode,
                    // copyHandler: this.copyEntity.bind(this),
                    entityType: ENTITY_TYPE.EQUIPMENT,
                    departmentalSecurity: departmentalSecurity,
                    screens: screenPermissions,
                    // screens: userData.screens[userData.assetScreen], // TODO: should this be 'userData.screens' like we saw in Part, Location and System? Or should this one be different? Why?
                    workorderScreencode: userData.workOrderScreen
                }}
                width={730}
                entityIcon={<AssetIcon style={{ height: 18 }} />}
                toggleHiddenRegion={toggleHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                regions={getRegions()}
                isHiddenRegion={isHiddenRegion}
                getHiddenRegionState={getHiddenRegionState}
                departmentalSecurity={departmentalSecurity} />
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

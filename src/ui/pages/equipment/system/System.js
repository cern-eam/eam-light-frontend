import React from 'react';
import queryString from "query-string";
import EquipmentHistory from '../components/EquipmentHistory.js'
import EamlightToolbarContainer from './../../../components/EamlightToolbarContainer'
import CustomFields from '../../../components/customfields/CustomFields'
import WSEquipment from "../../../../tools/WSEquipment"
import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'
import SystemGeneral from './SystemGeneral'
import SystemDetails from './SystemDetails'
import SystemHierarchy from './SystemHierarchy'
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentPartsAssociated from "../components/EquipmentPartsAssociated";
import {SystemIcon} from 'eam-components/dist/ui/components/icons'
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import {ENTITY_TYPE} from "../../../components/Toolbar";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentGraphIframe from '../../../components/iframes/EquipmentGraphIframe';
import { isCernMode } from '../../../components/CERNMode';
import { TAB_CODES } from '../../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../../EntityTools';
import useEntity from "hooks/useEntity";

const System = () => {
    // TODO: move this to respective input?
    const onChangeCategoryCode = code => {
        if(!code) {
            return;
        }

        //Fetch the category data
        return WSEquipment.getCategoryData(code).then(response => {
            const categoryData = response.body.data[0];

            if(!categoryData) {
                return;
            }

            this.setState(prevState => {
                const equipment = {...prevState.equipment};

                if(categoryData.categoryclass) {
                    equipment.classCode = categoryData.categoryclass;
                    equipment.classDesc = categoryData.categoryclassdesc;
                }

                if(categoryData.manufacturer) {
                    equipment.manufacturerCode = categoryData.manufacturer;
                }

                return {equipment};
            });
        }).catch(error => {
            console.log(error); // TODO: we should prob handleError?
        });
    };

    const queryParams = queryString.parse(window.location.search).length > 0 ?
                        queryString.parse(window.location.search) : '';

    // TODO: the entity was called equipment, should we rename to system?
    const {screenLayout: systemLayout, entity: equipment, loading,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, updateEntityProperty: updateEquipmentProperty, handleError, showError, showNotification} = useEntity({
            WS: {
                create: WSEquipment.createEquipment,
                read: WSEquipment.getEquipment,
                update: WSEquipment.updateEquipment,
                delete: WSEquipment.deleteEquipment,
                new:  WSEquipment.initEquipment.bind(null, "OBJ", "S", queryParams), // TODO: again we have extra arguments, does it perform basic functions without them?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
            },
            entityCode: "OBJ",
            entityDesc: "System",
            entityURL: "/system/",
            entityCodeProperty: "code",
            screenProperty: "systemScreen",
            layoutProperty: "systemLayout",
        });

    // TODO: keeping for context
    // settings = {
    //     handlerFunctions: {
    //         categoryCode: this.onChangeCategoryCode,
    //         classCode: this.onChangeClass,
    //     }
    // };

    function postInit() {
        // setStatuses(true); // TODO: confirm it works as expected
        setLayoutProperty('showEqpTreeButton', false)
        // this.enableChildren(); // TODO: keeping for context
    }

    function postCreate() {
        // setStatuses(false); // TODO: confirm it works as expected
        commentsComponent.current.createCommentForNewEntity();
        setLayoutProperty('showEqpTreeButton', true)
    }

    function postUpdate(equipment) {
        commentsComponent.current.createCommentForNewEntity();

        if (departmentalSecurity.readOnly) {
            // this.disableChildren(); // TODO: keeping for context
        } else {
            // this.enableChildren(); // TODO: keeping for context
        }
    }

    function postRead(equipment) {
        // setStatuses(false, equipment.statusCode); // TODO: confirm it works as expected
        setLayoutProperty('showEqpTreeButton', true);
        setLayoutProperty('equipment', equipment); // TODO: should we be relying on the 'equipment' arg? Shouldn't we pass the 'equipment' from useEntity?

        if (departmentalSecurity.readOnly) {
            // this.disableChildren(); // TODO: keeping for context
        } else {
            // this.enableChildren(); // TODO: keeping for context
        }
    }

    // TODO: Tested it and looked ok, but may be better to discuss because argument is called 'oldStatusCode' and we are passing the current status code.
    // const setStatuses = (neweqp, oldStatusCode) => {
    //     WSEquipment.getEquipmentStatusValues(userData.eamAccount.userGroup, neweqp, oldStatusCode)
    //         .then(response => {
    //             this.setLayout({statusValues: response.body.data})
    //         });
    // }

    // TODO:
    function preCreateEntity(equipment) {
        //Check hierarchy
        return setValuesHierarchy(equipment);
    }

    // TODO:
    function preUpdateEntity(equipment) {
        //Check hierarchy
        return setValuesHierarchy(equipment);
    }

    const setValuesHierarchy = (equipment) => {
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

    const getEDMSObjectType = (equipment) => {
        if (equipment.systemTypeCode === 'S' && ['B', 'M'].includes(equipment.typeCode)) {
            return 'A';
        }
        return 'X';
    }

    const getRegions = () => {
        const tabs = systemLayout.tabs;

        let commonProps = {
            equipment,
            newEntity,
            systemLayout,
            userGroup: userData.eamAccount.userGroup,
            updateEquipmentProperty, // TODO: here we already also referred to system just as equipment, whereas in part we specified
        };

        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <SystemGeneral
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
                    <SystemDetails
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
                    <SystemHierarchy
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
                        equipmenttype='S' />
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
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
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
                        parentScreen={screenPermissions.parentScreen} />
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
                        objectType={getEDMSObjectType(equipment)}
                        objectID={equipment.code} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_SYSTEMS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_SYSTEMS)
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
                        handleError={handleError}
                        allowHtml={true}
                        disabled={departmentalSecurity.readOnly} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 8,
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
                        entityLayout={systemLayout.fields}
                        updateUDFProperty={updateEquipmentProperty}
                        exclusions={[
                            'udfchar45'
                        ]} />
                ,
                column: 2,
                order: 9,
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
                order: 10,
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
                order: 11,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS)
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
                entityName="System" // TODO:
                entityKeyCode={equipment.code}
                saveHandler={saveHandler}
                newHandler={newHandler}
                deleteHandler={deleteHandler}
                toolbarProps={{
                    entityDesc: "System", // TODO:
                    entity: equipment,
                    // postInit: this.postInit.bind(this),
                    // setLayout: this.setLayout.bind(this),
                    newEntity: newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_SYSLI,
                    screencode: screenCode,
                    // copyHandler: this.copyEntity.bind(this),
                    entityType: ENTITY_TYPE.EQUIPMENT,
                    departmentalSecurity: departmentalSecurity,
                    screens: userData.screens,
                    workorderScreencode: userData.workOrderScreen
                }}
                width={730}
                entityIcon={<SystemIcon style={{height: 18}}/>}
                toggleHiddenRegion={toggleHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                regions={getRegions()}
                getHiddenRegionState={getHiddenRegionState}
                setRegionVisibility={setRegionVisibility}
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

export default System;

import React from 'react';
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
            console.log(error);
        });
    };

    const queryParams = queryString.parse(window.location.search).length > 0 ?
                        queryString.parse(window.location.search) : '';

    // TODO: the entity was called equipment, should we rename to position?
    const {screenLayout: positionLayout, entity: equipment, loading,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, updateEntityProperty: updateEquipmentProperty, handleError, showError, showNotification} = useEntity({
            WS: {
                create: WSEquipment.createEquipment,
                read: WSEquipment.getEquipment,
                update: WSEquipment.updateEquipment,
                delete: WSEquipment.deleteEquipment,
                new:  WSEquipment.initEquipment.bind(null, "OBJ", "P", queryParams), // TODO: again we have extra arguments. What to do?
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
            },
            entityDesc: "Position",
            entityURL: "/position/",
            entityCodeProperty: "code",
            screenProperty: "positionScreen",
            layoutProperty: "positionLayout",
        });

    // TODO: keeping for context
    // settings = {
        // handlerFunctions: {
        //     categoryCode: this.onChangeCategoryCode,
        //     classCode: this.onChangeClass,
        // }
    // }

    function postInit() {
        // this.setStatuses(true) // TODO: confirm it works as expected, 
        setLayoutProperty('showEqpTreeButton', false)
        // this.enableChildren(); // TODO: keeping for context
    }

    function postCreate() {
        // this.setStatuses(false); // TODO: confirm it works as expected, 
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
        // this.setStatuses(false, equipment.statusCode) // TODO: confirm it works as expected, 
        setLayoutProperty('showEqpTreeButton', true)
        setLayoutProperty('equipment', equipment)

        if (departmentalSecurity.readOnly) {
            // this.disableChildren(); // TODO: keeping for context
        } else {
            // this.enableChildren(); // TODO: keeping for context
        }
    }

    // TODO: Tested it and looked ok, but may be better to discuss because argument is called 'oldStatusCode' and we are passing the current status code.
    // const setStatuses = (neweqp, oldStatusCode) => {
    //     WSEquipment.getEquipmentStatusValues(this.props.userData.eamAccount.userGroup, neweqp, oldStatusCode)
    //         .then(response => {
    //             this.setLayout({statusValues: response.body.data})
    //         })
    // }

    const getRegions = () => {
        const tabs = positionLayout.tabs;

        const commonProps = {
            equipment,
            newEntity,
            positionLayout,
            userGroup: userData.eamAccount.userGroup,
            updateEquipmentProperty,
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
                        fields={equipment.userDefinedFields}
                        entityLayout={positionLayout.fields}
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
                        updateEntityProperty={updateEquipmentProperty}
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
                    newEntity: newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_POSLI,
                    screencode: screenCode,
                    // copyHandler: this.copyEntity.bind(this),
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

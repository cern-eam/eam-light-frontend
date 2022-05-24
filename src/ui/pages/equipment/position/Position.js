import React from 'react';
import Entity from '../../Entity'
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

export default class Position extends Entity {

    constructor(props) {
        super(props)
        this.setCriticalities()
    }
    
    onChangeCategoryCode = code => {
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

    settings = {
        entity: 'equipment',
        entityDesc: 'Position',
        entityURL: '/position/',
        entityCodeProperty: 'code',
        entityScreen: this.props.userData.screens[this.props.userData.positionScreen],
        renderEntity: this.renderPosition.bind(this),
        readEntity: WSEquipment.getEquipment.bind(WSEquipment),
        updateEntity: WSEquipment.updateEquipment.bind(WSEquipment),
        createEntity: WSEquipment.createEquipment.bind(WSEquipment),
        deleteEntity: WSEquipment.deleteEquipment.bind(WSEquipment),
        initNewEntity: () => WSEquipment.initEquipment("OBJ", "P", this.props.location.search),
        handlerFunctions: {
            categoryCode: this.onChangeCategoryCode,
            classCode: this.onChangeClass,
        }
    }

    postInit() {
        this.setStatuses(true)
        this.props.setLayoutProperty('showEqpTreeButton', false)
        this.enableChildren();
    }

    postCreate() {
        this.setStatuses(false);
        this.comments.createCommentForNewEntity();
        this.props.setLayoutProperty('showEqpTreeButton', true)
    }

    postUpdate(equipment) {
        this.comments.createCommentForNewEntity();

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else {
            this.enableChildren();
        }
    }

    postRead(equipment) {
        this.setStatuses(false)
        this.props.setLayoutProperty('showEqpTreeButton', true)
        this.props.setLayoutProperty('equipment', equipment)

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else {
            this.enableChildren();
        }
    }

    setStatuses(neweqp) {
        const oldStatusCode = this.state.equipment && this.state.equipment.statusCode;
        WSEquipment.getEquipmentStatusValues(this.props.userData.eamAccount.userGroup, neweqp, oldStatusCode)
            .then(response => {
                this.setLayout({statusValues: response.body.data})
            })
    }

    setCriticalities() {
        WSEquipment.getEquipmentCriticalityValues()
            .then(response => {
                this.setLayout({criticalityValues: response.body.data})
            })
    }

    getRegions = () => {
        const { positionLayout, userData, applicationData, showError, showNotification } = this.props;
        const { equipment, layout } = this.state;
        const tabs = positionLayout.tabs;


        const commonProps = {
            equipment,
            layout,
            positionLayout,
            updateEquipmentProperty: this.updateEntityProperty.bind(this),
            children: this.children,
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
                        ref={comments => this.comments = comments}
                        entityCode='OBJ'
                        entityKeyCode={!layout.newEntity ? equipment.code : undefined}
                        userCode={userData.eamAccount.userCode}
                        allowHtml={true}
                        disabled={this.departmentalSecurity.readOnly} />
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
                        updateUDFProperty={this.updateEntityProperty}
                        children={this.children} />
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
                        children={this.children}
                        entityCode='OBJ'
                        entityKeyCode={equipment.code}
                        classCode={equipment.classCode}
                        customFields={equipment.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)} />
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

    renderPosition() {
        const {
            applicationData,
            history,
            showEqpTree,
            toggleHiddenRegion,
            setRegionVisibility,
            userData,
            isHiddenRegion,
            getHiddenRegionState,
            getUniqueRegionID
        } = this.props;
        const { equipment, layout } = this.state;
        const regions = this.getRegions();        

        return (
            <BlockUi tag="div" blocking={layout.blocking} style={{width: '100%', height: "100%"}}>
                <EamlightToolbarContainer
                    isModified={layout.isModified}
                    newEntity={layout.newEntity}
                    entityScreen={userData.screens[userData.positionScreen]}
                    entityName={this.settings.entityDesc}
                    entityKeyCode={equipment.code}
                    saveHandler={this.saveHandler.bind(this)}
                    newHandler={() => history.push('/position')}
                    deleteHandler={this.deleteEntity.bind(this, equipment.code)}
                    toolbarProps={{
                        entityDesc: this.settings.entityDesc,
                        entity: equipment,
                        postInit: this.postInit.bind(this),
                        setLayout: this.setLayout.bind(this),
                        newEntity: layout.newEntity,
                        applicationData: applicationData,
                        extendedLink: applicationData.EL_POSLI,
                        screencode: userData.positionScreen,
                        copyHandler: this.copyEntity.bind(this),
                        entityType: ENTITY_TYPE.EQUIPMENT,
                        departmentalSecurity: this.departmentalSecurity,
                        screens: userData.screens,
                        workorderScreencode: userData.workorderScreen
                    }}
                    width={730}
                    entityIcon={<PositionIcon style={{height: 18}}/>}
                    toggleHiddenRegion={toggleHiddenRegion}
                    getUniqueRegionID={getUniqueRegionID}
                    regions={regions}
                    getHiddenRegionState={getHiddenRegionState}
                    isHiddenRegion={isHiddenRegion}
                    departmentalSecurity={this.departmentalSecurity} />
                <EntityRegions
                    showEqpTree={showEqpTree}
                    regions={regions}
                    isNewEntity={layout.newEntity} 
                    getUniqueRegionID={getUniqueRegionID}
                    getHiddenRegionState={getHiddenRegionState}
                    setRegionVisibility={setRegionVisibility}
                    isHiddenRegion={isHiddenRegion}/>
            </BlockUi>
        )
    }
}



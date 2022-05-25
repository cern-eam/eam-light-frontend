import Comments from 'eam-components/ui/components/comments/Comments';
import { AssetIcon } from 'eam-components/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import WSEquipment from "../../../../tools/WSEquipment";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import CustomFields from '../../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import Entity from '../../Entity';
import EquipmentHistory from '../components/EquipmentHistory.js';
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EamlightToolbarContainer from './../../../components/EamlightToolbarContainer';
import AssetDetails from './AssetDetails';
import AssetGeneral from './AssetGeneral';
import AssetHierarchy from './AssetHierarchy';
import EquipmentTools from "../EquipmentTools";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentPartsMadeOf from "../components/EquipmentPartsMadeOf";
import WSParts from '../../../../tools/WSParts';
import EquipmentGraphIframe from '../../../components/iframes/EquipmentGraphIframe';
import { isCernMode } from '../../../components/CERNMode';
import { TAB_CODES } from '../../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../../EntityTools';
import NCRIframeContainer from '../../../components/iframes/NCRIframeContainer';

export default class Asset extends Entity {

    constructor(props) {
        super(props)
        this.setCriticalityValues()
        this.setStateValues();
        this.state = {
            ...this.state
        }
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
        entityDesc: 'Asset',
        entityURL: '/asset/',
        entityCodeProperty: 'code',
        entityScreen: this.props.userData.screens[this.props.userData.assetScreen],
        renderEntity: this.renderAsset.bind(this),
        readEntity: WSEquipment.getEquipment.bind(WSEquipment),
        updateEntity: WSEquipment.updateEquipment.bind(WSEquipment),
        createEntity: WSEquipment.createEquipment.bind(WSEquipment),
        deleteEntity: WSEquipment.deleteEquipment.bind(WSEquipment),
        initNewEntity: () => WSEquipment.initEquipment("OBJ", "A", this.props.location.search),
        layout: this.props.assetLayout,
        layoutPropertiesMap: EquipmentTools.assetLayoutPropertiesMap,
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
        this.setAssetPart(this.state.equipment.partCode)

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else {
            this.enableChildren();
        }
    }

    postRead(equipment) {
        this.setStatuses(false)
        this.props.setLayoutProperty('showEqpTreeButton', true)
        this.props.setLayoutProperty('equipment', equipment);
        this.setAssetPart(equipment.partCode);

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
                this.setLayout({ statusValues: response.body.data })
            })
    }

    setCriticalityValues() {
        WSEquipment.getEquipmentCriticalityValues()
            .then(response => {
                this.setLayout({ criticalityValues: response.body.data })
            })
    }

    setStateValues() {
        WSEquipment.getEquipmentStateValues()
            .then(response => {
                this.setLayout({ stateValues: response.body.data })
            })
    }

    preCreateEntity(equipment) {
        //Check hierarchy
        return this.setValuesHierarchy(equipment);
    }

    preUpdateEntity(equipment) {
        //Check hierarchy
        return this.setValuesHierarchy(equipment);
    }

    setValuesHierarchy = (equipment) => {
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


    getRegions = () => {
        const { assetLayout, userData, applicationData, showError, showNotification } = this.props;
        const { equipment, layout } = this.state;
        const tabs = assetLayout.tabs;

        const commonProps = {
            equipment,
            layout,
            assetLayout,
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
                        entityLayout={assetLayout.fields}
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
                id : 'PARTCUSTOMFIELDS',
                label : 'Part Custom Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => this.state.part,
                render: () => 
                    <CustomFields 
                        children={this.children}
                        entityCode='PART'
                        entityKeyCode={this.state.part && this.state.part.code}
                        classCode={this.state.part && this.state.part.classCode}
                        customFields={layout.partCustomField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        readonly={true}/>
                ,
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

    setAssetPart = partCode=> {
        return WSParts.getPart(partCode).then(response => {
            this.setState({part: response.body.data})
            this.setLayout({partCustomField: response.body.data.customField})
        }).catch(error => {
            this.setState({part: undefined})
            this.setLayout({partCustomField: undefined})
        });
    };

    renderAsset() {
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
            <BlockUi tag="div" blocking={layout.blocking} style={{ height: "100%", width: "100%" }}>
                <EamlightToolbarContainer
                    isModified={layout.isModified}
                    newEntity={layout.newEntity}
                    entityScreen={userData.screens[userData.assetScreen]}
                    entityName="Asset"
                    entityKeyCode={equipment.code}
                    saveHandler={this.saveHandler.bind(this)}
                    newHandler={() => history.push('/asset')}
                    deleteHandler={this.deleteEntity.bind(this, equipment.code)}
                    toolbarProps={{
                        entityDesc: this.settings.entityDesc,
                        entity: equipment,
                        postInit: this.postInit.bind(this),
                        setLayout: this.setLayout.bind(this),
                        newEntity: layout.newEntity,
                        applicationData: applicationData,
                        extendedLink: applicationData.EL_ASSLI,
                        screencode: userData.assetScreen,
                        copyHandler: this.copyEntity.bind(this),
                        entityType: ENTITY_TYPE.EQUIPMENT,
                        departmentalSecurity: this.departmentalSecurity,
                        screens: userData.screens[userData.assetScreen],
                        workorderScreencode: userData.workorderScreen
                    }}
                    width={730}
                    entityIcon={<AssetIcon style={{ height: 18 }} />}
                    toggleHiddenRegion={toggleHiddenRegion}
                    getUniqueRegionID={getUniqueRegionID}
                    regions={regions}
                    isHiddenRegion={isHiddenRegion}
                    getHiddenRegionState={getHiddenRegionState}
                    departmentalSecurity={this.departmentalSecurity} />
                <EntityRegions
                    showEqpTree={showEqpTree}
                    regions={regions}
                    isNewEntity={layout.newEntity} 
                    isHiddenRegion={isHiddenRegion}
                    getUniqueRegionID={getUniqueRegionID}
                    setRegionVisibility={setRegionVisibility}
                    getHiddenRegionState={getHiddenRegionState}/>
            </BlockUi>
        )
    }
}



import Grid from '@material-ui/core/Grid';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import EDMSWidget from 'eam-components/dist/ui/components/edms/EDMSWidget';
import {AssetIcon} from 'eam-components/dist/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import WSEquipment from "../../../../tools/WSEquipment";
import {TOOLBARS} from "../../../components/AbstractToolbar";
import CustomFields from '../../../components/customfields/CustomFields';
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import Entity from '../../Entity';
import EquipmentHistory from '../components/EquipmentHistory.js';
import EquipmentPartsAssociated from "../components/EquipmentPartsAssociated";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EamlightToolbar from './../../../components/EamlightToolbar';
import AssetDetails from './AssetDetails';
import AssetGeneral from './AssetGeneral';
import AssetHierarchy from './AssetHierarchy';

export default class Asset extends Entity {

    constructor(props) {
        super(props)
        this.setCriticalities()
        this.state = {
            ...this.state
        }
    }

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
        initNewEntity: () => WSEquipment.initEquipment("OBJ", "A", "OSOBJA",
            this.props.userData.screens[this.props.userData.assetScreen].screenCode,
            this.props.location.search && this.props.location.search.replace('newCode=', 'code='))
    }

    postInit() {
        this.setStatuses(true)
        this.props.setLayoutProperty('showEqpTreeButton', false)
    }

    postCreate() {
        this.setStatuses(false);
        this.comments.createCommentForNewEntity();
        this.props.setLayoutProperty('showEqpTreeButton', true)
    }

    postUpdate() {
        this.comments.createCommentForNewEntity();
    }

    postRead() {
        this.setStatuses(false)
        this.props.setLayoutProperty('showEqpTreeButton', true)
        this.props.setLayoutProperty('equipment', this.state.equipment)
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

    //
    //
    //
    getRegions = () => {
        let user = this.props.userData.eamAccount.userCode
        let screen = this.props.userData.screens[this.props.userData.assetScreen].screenCode
        return {
            DETAILS: {label: "Details", code: user + "_" + screen + "_DETAILS"},
            HIERARCHY: {label: "Hierarchy", code: user + "_" + screen+ "_HIERARCHY"},
            WORKORDERS: {label: "Work Orders", code: user + "_" + screen+ "_WORKORDERS"},
            HISTORY: {label: "History", code: user + "_" + screen+ "_HISTORY"},
            PARTS: {label: "Parts Associated", code: user + "_" + screen+ "_PARTS"},
            EDMSDOCS: {label: "EDMS Documents", code: user + "_" + screen+ "_EDMSDOCS"},
            NCRS: {label: "NCRs", code: user + "_" + screen+ "_NCRS"},
            COMMENTS: {label: "Comments", code: user + "_" + screen+ "_COMMENTS"},
            USERDEFFIELDS: {label: "User Defined Fields", code: user + "_" + screen+ "_USERDEFFIELDS"},
            CUSTOMFIELDS: {label: "Custom Fields", code: user + "_" + screen+ "_CUSTOMFIELDS"}
        }
    }

    //
    // RENDER
    //
    renderAsset() {

        let props = {
            equipment: this.state.equipment,
            updateEquipmentProperty: this.updateEntityProperty.bind(this),
            layout: this.state.layout,
            assetLayout: this.props.assetLayout,
            children: this.children
        }

        // Adapt the grid layout depending on the visibility of the tree
        let xs = 12;  // 0   - 600 px
        let sm = 12;  // 600 - 960 px
        let md = 6;   // 690 - 1280 px
        let lg = 6;   // 1280 - ...
        if (this.props.showEqpTree) {
            sm = 12;
            md = 12;
            lg = 6;
        }

        return (
            <BlockUi tag="div" blocking={this.state.layout.blocking} style={{height: "100%", width: "100%"}}>

                <EamlightToolbar isModified={this.state.layout.isModified}
                                 newEntity={this.state.layout.newEntity}
                                 entityScreen={this.props.userData.screens[this.props.userData.assetScreen]}
                                 entityName="Asset"
                                 entityKeyCode={this.state.equipment.code}
                                 saveHandler={this.saveHandler.bind(this)}
                                 newHandler={() => this.props.history.push('/asset')}
                                 deleteHandler={this.deleteEntity.bind(this, this.state.equipment.code)}
                                 toolbarProps={{
                                    _toolbarType: TOOLBARS.EQUIPMENT,
                                    entityDesc: this.settings.entityDesc,
                                    equipment: this.state.equipment,
                                    postInit: this.postInit.bind(this),
                                    setLayout: this.setLayout.bind(this),
                                    newEquipment: this.state.layout.newEntity,
                                    applicationData: this.props.applicationData,
                                    extendedLink: this.props.applicationData.EL_ASSLI,
                                    screencode: this.props.userData.screens[this.props.userData.assetScreen].screenCode
                                 }}
                                 width={730}
                                 entityIcon={<AssetIcon style={{height: 18}}/>}
                                 toggleHiddenRegion={this.props.toggleHiddenRegion}
                                 regions={this.getRegions()}
                                 hiddenRegions={this.props.hiddenRegions}>
                </EamlightToolbar>

                <div className="entityMain">

                    <Grid container spacing={1}>
                        <Grid item xs={xs} sm={sm} md={md} lg={lg}>

                            <AssetGeneral {...props} />

                            {!this.props.hiddenRegions[this.getRegions().DETAILS.code] &&
                            <AssetDetails {...props} />
                            }

                            {!this.props.hiddenRegions[this.getRegions().HIERARCHY.code] &&
                            <AssetHierarchy {...props} />
                            }

                            {!this.props.hiddenRegions[this.getRegions().WORKORDERS.code] &&
                             !this.state.layout.newEntity &&
                            <EquipmentWorkOrders equipmentcode={this.state.equipment.code}/>}

                            {!this.props.hiddenRegions[this.getRegions().HISTORY.code] &&
                             !this.state.layout.newEntity &&
                            <EquipmentHistory equipmentcode={this.state.equipment.code}/>}

                            {!this.props.hiddenRegions[this.getRegions().PARTS.code] &&
                             !this.state.layout.newEntity &&
                            <EquipmentPartsAssociated equipmentcode={this.state.equipment.code}
                                                      parentScreen={this.props.userData.assetScreen.parentScreen}/>}

                        </Grid>
                        <Grid item xs={xs} sm={sm} md={md} lg={lg}>

                            {!this.props.hiddenRegions[this.getRegions().EDMSDOCS.code] &&
                            !this.state.layout.newEntity &&
                            <EDMSDoclightIframeContainer objectType="A" objectID={this.state.equipment.code}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().NCRS.code] &&
                            !this.state.layout.newEntity &&
                            <EDMSWidget objectID={this.state.equipment.code} objectType="A"
                                                 creationMode="NCR"
                                                 title="NCRs"
                                                 edmsDocListLink={this.props.applicationData.edmsDocListLink}/>}

                            {!this.props.hiddenRegions[this.getRegions().COMMENTS.code] &&
                            <Comments ref={comments => this.comments = comments}
                                               entityCode='OBJ'
                                               entityKeyCode={!this.state.layout.newEntity ? this.state.equipment.code : undefined}
                                               userDesc={this.props.userData.eamAccount.userDesc}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().USERDEFFIELDS.code] &&
                            <UserDefinedFields fields={this.state.equipment.userDefinedFields}
                                               entityLayout={this.props.assetLayout.fields}
                                               updateUDFProperty={this.updateEntityProperty}
                                               children={this.children}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().CUSTOMFIELDS.code] &&
                            <CustomFields entityCode='OBJ'
                                          entityKeyCode={this.state.equipment.code}
                                          classCode={this.state.equipment.classCode}
                                          customFields={this.state.equipment.customField}
                                          updateEntityProperty={this.updateEntityProperty.bind(this)}/>}

                        </Grid>

                    </Grid>
                </div>
            </BlockUi>
        )
    }
}



import React from "react";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import LocationIcon from "@mui/icons-material/Room";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSLocation from "../../../../tools/WSLocation";
import {ENTITY_TYPE} from "../../../components/Toolbar";
import CustomFields from "../../../components/customfields/CustomFields";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import Entity from "../../Entity";
import EquipmentHistory from "../components/EquipmentHistory.js";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EamlightToolbarContainer from "./../../../components/EamlightToolbarContainer";
import LocationDetails from "./LocationDetails";
import LocationGeneral from "./LocationGeneral";
import LocationHierarchy from "./LocationHierarchy";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentGraphIframe from '../../../components/iframes/EquipmentGraphIframe';
import { isCernMode } from '../../../components/CERNMode';
import { TAB_CODES } from '../../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../../EntityTools';

export default class Location extends Entity {
    settings = {
        entity: "location",
        entityDesc: "Location",
        entityURL: "/location/",
        entityCodeProperty: "code",
        entityScreen: this.props.userData.screens[this.props.userData.locationScreen],
        renderEntity: this.renderLocation.bind(this),
        readEntity: WSLocation.get,
        updateEntity: WSLocation.update,
        createEntity: WSLocation.create,
        deleteEntity: WSLocation.remove,
        initNewEntity: () => WSLocation.init(),
        handlerFunctions: {
            classCode: this.onChangeClass,
        }
    }

    postInit() {
        this.props.setLayoutProperty('showEqpTreeButton', false)
        this.enableChildren();
    }

    postCreate(equipment) {
        this.comments.createCommentForNewEntity();
        this.props.setLayoutProperty("showEqpTreeButton", true)
    }

    postUpdate(equipment) {
        this.comments.createCommentForNewEntity();

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else {
            this.enableChildren();
        }
    }

    postRead() {
        this.props.setLayoutProperty("showEqpTreeButton", true)
        this.props.setLayoutProperty("location", this.state.location)

        if (this.departmentalSecurity.readOnly) {
            this.disableChildren();
        } else {
            this.enableChildren();
        }
    }

    getRegions = () => {
        const { locationLayout, userData, applicationData } = this.props;
        const { location, layout } = this.state;
        const tabs = locationLayout.tabs; 

        const commonProps = {
            location,
            layout,
            locationLayout,
            updateEquipmentProperty: this.updateEntityProperty.bind(this),
            children: this.children
        }

        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <LocationGeneral
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
                    <LocationDetails
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
                    <LocationHierarchy
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
                        equipmentcode={location.code}
                        defaultFilter={panelQueryParams.defaultFilter}
                        equipmenttype='L' />
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
                maximizable: true,
                render: () => 
                    <EquipmentHistory
                        equipmentcode={location.code} />
                ,
                column: 1,
                order: 5,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS)
            },
            {
                id: 'EDMSDOCUMENTS',
                label: 'EDMS Documents',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EDMSDoclightIframeContainer
                        objectType="L"
                        objectID={location.code} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 6,
                ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_LOCATIONS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_LOCATIONS)
            },
            // {
            //     id: 'NCRS',
            //     label: 'NCRs',
            //     isVisibleWhenNewEntity: false,
            //     maximizable: false,
            //     render: () => 
            //         <EDMSWidget
            //             objectID={location.code}
            //             objectType="L"
            //             creationMode="NCR"
            //             edmsDocListLink={applicationData.EL_EDMSL}
            //             showError={showError}
            //             showSuccess={showSuccess} />
            //     ,
            //     column: 2,
            //     order: 7
            // },
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <Comments ref={comments => this.comments = comments}
                        entityCode="LOC"
                        entityKeyCode={!layout.newEntity ? location.code : undefined}
                        userCode={userData.eamAccount.userCode}
                        allowHtml={true}
                        disabled={this.departmentalSecurity.readOnly}/>
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
                        fields={location.userDefinedFields}
                        entityLayout={locationLayout.fields}
                        updateUDFProperty={this.updateEntityProperty}
                        children={this.children} />
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
                        children={this.children}
                        entityCode='LOC'
                        entityKeyCode={location.code}
                        classCode={location.classCode}
                        customFields={location.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)} />
                ,
                column: 2,
                order: 10,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            // {
            //     id: 'EQUIPMENTGRAPH',
            //     label: 'Equipment Graph',
            //     isVisibleWhenNewEntity: false,
            //     maximizable: true,
            //     render: () => 
            //         <EquipmentGraphIframe
            //             equipmentCode={location.code} 
            //             equipmentGraphURL={applicationData.EL_EQGRH}
            //         />
            //     ,
            //     RegionPanelProps: {
            //         detailsStyle: { padding: 0 }
            //     },
            //     column: 2,
            //     order: 11,
            //     ignore: !isCernMode,
            //     initialVisibility: false
            // },
        ]

    }

    renderLocation() {
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
        const { location, layout } = this.state
        const regions = this.getRegions();        


        return (
            <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: "100%"}}>
                <EamlightToolbarContainer isModified={layout.isModified}
                                 newEntity={layout.newEntity}
                                 entityScreen={userData.screens[userData.locationScreen]}
                                 entityName="Location"
                                 entityKeyCode={location.code}
                                 saveHandler={this.saveHandler.bind(this)}
                                 newHandler={() => history.push("/location")}
                                 deleteHandler={this.deleteEntity.bind(this, location.code)}
                                 toolbarProps={{
                                    entityDesc: this.settings.entityDesc,
                                    entity: location,
                                    postInit: this.postInit.bind(this),
                                    setLayout: this.setLayout.bind(this),
                                    newEntity: layout.newEntity,
                                    applicationData: applicationData,
                                    extendedLink: applicationData.EL_LOCLI,
                                    screencode: userData.screens[userData.locationScreen].screenCode,
                                    copyHandler: this.copyEntity.bind(this),
                                    entityType: ENTITY_TYPE.LOCATION,
                                    departmentalSecurity: this.departmentalSecurity,
                                    screens: userData.screens,
                                    workorderScreencode: userData.workorderScreen
                                 }}
                                 width={730}
                                 entityIcon={<LocationIcon style={{height: 18}}/>}
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
                    setRegionVisibility={setRegionVisibility}
                    getUniqueRegionID={getUniqueRegionID}
                    getHiddenRegionState={getHiddenRegionState}/>
            </BlockUi>
        )
    }
}



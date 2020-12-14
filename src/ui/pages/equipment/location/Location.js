import React from "react";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import LocationIcon from "@material-ui/icons/Room";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import WSLocation from "../../../../tools/WSLocation";
import {TOOLBARS} from "../../../components/AbstractToolbar";
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
    }

    postCreate() {
        this.comments.createCommentForNewEntity();
        this.props.setLayoutProperty("showEqpTreeButton", true)
    }

    postUpdate() {
        this.comments.createCommentForNewEntity();
    }

    postRead() {
        this.props.setLayoutProperty("showEqpTreeButton", true)
        this.props.setLayoutProperty("location", this.state.location)
    }

    getRegions = () => {
        const { locationLayout, userData, applicationData } = this.props;
        const { location, layout } = this.state;
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
                order: 1
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
                order: 2
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
                order: 3
            },
            {
                id: 'WORKORDERS',
                label: 'Work Orders',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: ({ panelQueryParams }) => 
                    <EquipmentWorkOrders
                        equipmentcode={location.code}
                        defaultFilter={panelQueryParams.defaultFilter}/>
                ,
                column: 1,
                order: 4
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
                order: 5
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
                order: 6
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
                        allowHtml={true}/>
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 8
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
                order: 9
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
                order: 10
            },
            {
                id: 'EQUIPMENTGRAPH',
                label: 'Equipment Graph',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EquipmentGraphIframe
                        equipmentCode={location.code} 
                        equipmentGraphURL={applicationData.EL_EQGRH}
                    />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 11
            },
        ]

    }

    renderLocation() {
        const {
            applicationData,
            history,
            showEqpTree,
            toggleHiddenRegion,
            userData,
            isHiddenRegion,
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
                                    _toolbarType: TOOLBARS.LOCATION,
                                    entityDesc: this.settings.entityDesc,
                                    equipment: location,
                                    postInit: this.postInit.bind(this),
                                    setLayout: this.setLayout.bind(this),
                                    newEquipment: layout.newEntity,
                                    applicationData: applicationData,
                                    extendedLink: applicationData.EL_LOCLI,
                                    screencode: userData.screens[userData.locationScreen].screenCode
                                 }}
                                 width={730}
                                 entityIcon={<LocationIcon style={{height: 18}}/>}
                                 toggleHiddenRegion={toggleHiddenRegion}
                                 getUniqueRegionID={getUniqueRegionID}
                                 regions={regions}
                                 isHiddenRegion={isHiddenRegion}>
                </EamlightToolbarContainer>
                <EntityRegions
                    showEqpTree={showEqpTree}
                    regions={regions}
                    isNewEntity={layout.newEntity} 
                    isHiddenRegion={isHiddenRegion}/>
            </BlockUi>
        )
    }
}



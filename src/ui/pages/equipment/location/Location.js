import Grid from "@material-ui/core/Grid";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import EDMSWidget from "eam-components/dist/ui/components/edms/EDMSWidget";
import LocationIcon from "@material-ui/icons/Room";
import React from "react";
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
import EamlightToolbar from "./../../../components/EamlightToolbar";
import LocationDetails from "./LocationDetails";
import LocationGeneral from "./LocationGeneral";
import LocationHierarchy from "./LocationHierarchy";

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
        initNewEntity: () => WSLocation.init()
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
        let user = this.props.userData.eamAccount.userCode
        let screen = this.props.userData.screens[this.props.userData.locationScreen].screenCode
        return {
            DETAILS: {label: "Details", code: user + "_" + screen + "_DETAILS"},
            HIERARCHY: {label: "Hierarchy", code: user + "_" + screen+ "_HIERARCHY"},
            WORKORDERS: {label: "Work Orders", code: user + "_" + screen+ "_WORKORDERS"},
            HISTORY: {label: "History", code: user + "_" + screen+ "_HISTORY"},
            EDMSDOCS: {label: "EDMS Documents", code: user + "_" + screen+ "_EDMSDOCS"},
            COMMENTS: {label: "Comments", code: user + "_" + screen+ "_COMMENTS"},
            USERDEFFIELDS: {label: "User Defined Fields", code: user + "_" + screen+ "_USERDEFFIELDS"},
            CUSTOMFIELDS: {label: "Custom Fields", code: user + "_" + screen+ "_CUSTOMFIELDS"}
        }
    }

    renderLocation() {
        const panelProps = {
            location: this.state.location,
            updateEquipmentProperty: this.updateEntityProperty.bind(this),
            layout: this.state.layout,
            locationLayout: this.props.locationLayout,
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
                                 entityScreen={this.props.userData.screens[this.props.userData.locationScreen]}
                                 entityName="Location"
                                 entityKeyCode={this.state.location.code}
                                 saveHandler={this.saveHandler.bind(this)}
                                 newHandler={() => this.props.history.push("/location")}
                                 deleteHandler={this.deleteEntity.bind(this, this.state.location.code)}
                                 toolbarProps={{
                                    _toolbarType: TOOLBARS.LOCATION,
                                    entityDesc: this.settings.entityDesc,
                                    equipment: this.state.location,
                                    postInit: this.postInit.bind(this),
                                    setLayout: this.setLayout.bind(this),
                                    newEquipment: this.state.layout.newEntity,
                                    applicationData: this.props.applicationData,
                                    extendedLink: this.props.applicationData.EL_ASSLI,
                                    screencode: this.props.userData.screens[this.props.userData.locationScreen].screenCode
                                 }}
                                 width={730}
                                 entityIcon={<LocationIcon style={{height: 18}}/>}
                                 toggleHiddenRegion={this.props.toggleHiddenRegion}
                                 regions={this.getRegions()}
                                 hiddenRegions={this.props.hiddenRegions}>
                </EamlightToolbar>

                <div className="entityMain">
                    <Grid container spacing={1}>
                        <Grid item xs={xs} sm={sm} md={md} lg={lg}>
                            <LocationGeneral {...panelProps} />

                            {!this.props.hiddenRegions[this.getRegions().DETAILS.code] &&
                            <LocationDetails {...panelProps} />
                            }

                            {!this.props.hiddenRegions[this.getRegions().HIERARCHY.code] &&
                            <LocationHierarchy {...panelProps} />
                            }

                            {!this.props.hiddenRegions[this.getRegions().WORKORDERS.code] &&
                             !this.state.layout.newEntity &&
                            <EquipmentWorkOrders equipmentcode={this.state.location.code}/>}

                            {!this.props.hiddenRegions[this.getRegions().HISTORY.code] &&
                             !this.state.layout.newEntity &&
                            <EquipmentHistory equipmentcode={this.state.location.code}/>}
                        </Grid>
                        <Grid item xs={xs} sm={sm} md={md} lg={lg}>
                            {!this.props.hiddenRegions[this.getRegions().EDMSDOCS.code] &&
                            !this.state.layout.newEntity &&
                            <EDMSDoclightIframeContainer objectType="L" objectID={this.state.location.code}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().COMMENTS.code] &&
                            <Comments ref={comments => this.comments = comments}
                                               entityCode="LOC"
                                               entityKeyCode={!this.state.layout.newEntity ? this.state.location.code : undefined}
                                               userDesc={this.props.userData.eamAccount.userDesc}
                                               allowHtml={true}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().USERDEFFIELDS.code] &&
                            <UserDefinedFields fields={this.state.location.userDefinedFields}
                                               entityLayout={this.props.locationLayout.fields}
                                               updateUDFProperty={this.updateEntityProperty}
                                               children={this.children}/>
                            }

                            {!this.props.hiddenRegions[this.getRegions().CUSTOMFIELDS.code] &&
                            <CustomFields children={this.children}
                                          entityCode="LOC"
                                          entityKeyCode={this.state.location.code}
                                          classCode={this.state.location.classCode}
                                          customFields={this.state.location.customField}
                                          updateEntityProperty={this.updateEntityProperty.bind(this)}/>}
                        </Grid>
                    </Grid>
                </div>
            </BlockUi>
        )
    }
}



import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { WorkorderIcon } from 'eam-components/dist/ui/components/icons';
import { ContentCopy, EmailOutline, Map, OpenInNew, Video } from 'mdi-material-ui';
import React from 'react';
import { Link } from 'react-router-dom';

class EquipmentToolbar {

    divStyle = {
        width: "100%",
        display: "flex",
        alignItems: "center"
    }

    iconStyle = {
        width: 20,
        height: 20
    }

    iconMenuStyle = {
        marginRight: 5,
        width: 20,
        height: 20
    }

    toolbarIconsStyle = {
        width: "100%",
        alignItems: "center",
        display: "flex"
    }

    verticalLineStyle = {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    }

    constructor(entityDesc, equipment, postInit, setLayout, newEquipment, applicationData, screencode) {
        this.entityDesc = entityDesc
        this.equipment = equipment
        this.postInit = postInit
        this.setLayout = setLayout
        this.newEquipment = newEquipment
        this.applicationData = applicationData
        this.screencode = screencode
    }

    copyEquipmentHandler() {
        this.setLayout({newEntity: true});
        this.postInit();
    }

    emailEquipmentHandler() {
        window.open("mailto:?Subject=" + this.entityDesc + " Code " + this.equipment.code + "&body=http://www.cern.ch/eam-light/equipment/" + this.equipment.code, '_self');

    }

    showOnMapHandler() {
        window.open(this.applicationData.gisprocedureLinkEQP + this.equipment.code, '_blank');
    }

    showInExtendedHandler() {
        console.log('screen', this.screencode)
        const extendedLink = this.applicationData.extendedAssetLink.replace("&1", this.screencode).replace("&2", this.equipment.code);
        window.open(extendedLink, '_blank');
    }

    showInPanoramasHandler () {
        //TODO - maybe fetch slotName and on response go to page?
        window.open(`${this.applicationData.panoramasViewerLink}?slotName=${this.equipment.udfnum01}`, '_blank');
    }

    renderMenuItems() {
        return (
            <div >
                <Divider/>
                <MenuItem onClick={this.copyEquipmentHandler.bind(this)} disabled={this.newEquipment}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}> Copy {this.entityDesc}</div>
                </MenuItem>
                <MenuItem onClick={this.emailEquipmentHandler.bind(this)} disabled={this.newEquipment}>
                    <EmailOutline style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Email {this.entityDesc}</div>
                </MenuItem>
                <MenuItem onClick={this.showOnMapHandler.bind(this)} disabled={this.newEquipment}>
                    <Map style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Show on Map</div>
                </MenuItem>
                <MenuItem disabled={this.newEquipment}>
                    <Link to={'/workorder?equipmentcode=' + this.equipment.code}
                          style={{display: "flex", color: "black", alignItems: "center", textDecoration: "none"}}>
                        <WorkorderIcon style={this.iconStyle}/>
                        <div style={this.menuLabelStyle}>Create new WO</div>
                    </Link>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.newEquipment}>
                    <OpenInNew style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Show in Infor EAM</div>
                </MenuItem>
            </div>
        );
    }

    renderToolbarIconsRow() {

        return (
            <div style={this.toolbarIconsStyle}>
                <div style={this.verticalLineStyle}/>
                <Tooltip title={"Copy " + this.entityDesc}>
                    <IconButton onClick={this.copyEquipmentHandler.bind(this)} disabled={this.newEquipment}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title={"E-Mail " + this.entityDesc}>
                    <IconButton onClick={this.emailEquipmentHandler.bind(this)} disabled={this.newEquipment}>
                        <EmailOutline style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show on Map">
                    <IconButton onClick={this.showOnMapHandler.bind(this)} disabled={this.newEquipment}>
                        <Map style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Create Work Order">
                    <Link to={'/workorder?equipmentcode=' + this.equipment.code}
                          style={{display: "flex", color: "black", alignItems: "center", textDecoration: "none"}}>
                        <IconButton disabled={this.newEquipment}>
                            <WorkorderIcon style={this.iconStyle}/>
                        </IconButton>
                    </Link>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.newEquipment}>
                        <OpenInNew style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                {this.equipment.typeCode === 'P' && this.applicationData.panoramasViewerLink &&
                <Tooltip title="Panoramas">
                    <IconButton onClick={this.showInPanoramasHandler.bind(this)}>
                    
                        <Video style={this.iconStyle} />
                    </IconButton>
                </Tooltip>
                }
            </div>
        );
    }

}

export default EquipmentToolbar
import React, {Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import {Link} from 'react-router-dom'
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons'
import Divider from '@material-ui/core/Divider';
import {ContentCopy, EmailOutline, Map, OpenInNew} from 'mdi-material-ui'

class EquipmentToolbar extends Component {

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
        alignItems: "center",
        display: "flex"
    }

    verticalLineStyle = {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    }

    copyEquipmentHandler() {
        this.props.setLayout({newEntity: true});
        this.props.postInit();
    }

    emailEquipmentHandler() {
        window.open("mailto:?Subject=" + this.props.entityDesc + " Code " + this.props.equipment.code + "&body=http://www.cern.ch/eam-light/equipment/" + this.props.equipment.code, '_self');

    }

    showOnMapHandler() {
        window.open(this.props.applicationData.EL_GISEQ + this.props.equipment.code, '_blank');
    }

    showInExtendedHandler() {
        const extendedLink = this.props.extendedLink.replace("&1", this.props.screencode).replace("&2", this.props.equipment.code);
        window.open(extendedLink, '_blank');
    }

    renderMenuItems() {
        return (
            <div >
                <Divider/>
                <MenuItem onClick={this.copyEquipmentHandler.bind(this)} disabled={this.props.newEquipment}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}> Copy {this.props.entityDesc}</div>
                </MenuItem>
                <MenuItem onClick={this.emailEquipmentHandler.bind(this)} disabled={this.props.newEquipment}>
                    <EmailOutline style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Email {this.props.entityDesc}</div>
                </MenuItem>
                <MenuItem onClick={this.showOnMapHandler.bind(this)} disabled={this.props.newEquipment}>
                    <Map style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Show on Map</div>
                </MenuItem>
                <MenuItem disabled={this.props.newEquipment}>
                    <Link to={'/workorder?equipmentcode=' + this.props.equipment.code}
                          style={{display: "flex", color: "black", alignItems: "center", textDecoration: "none"}}>
                        <WorkorderIcon style={this.iconStyle}/>
                        <div style={this.menuLabelStyle}>Create new WO</div>
                    </Link>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newEquipment}>
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
                <Tooltip title={"Copy " + this.props.entityDesc}>
                    <IconButton onClick={this.copyEquipmentHandler.bind(this)} disabled={this.props.newEquipment}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title={"E-Mail " + this.props.entityDesc}>
                    <IconButton onClick={this.emailEquipmentHandler.bind(this)} disabled={this.props.newEquipment}>
                        <EmailOutline style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show on Map">
                    <IconButton onClick={this.showOnMapHandler.bind(this)} disabled={this.props.newEquipment}>
                        <Map style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Create Work Order">
                    <Link to={'/workorder?equipmentcode=' + this.props.equipment.code}
                          style={{display: "flex", color: "black", alignItems: "center", textDecoration: "none"}}>
                        <IconButton disabled={this.props.newEquipment}>
                            <WorkorderIcon style={this.iconStyle}/>
                        </IconButton>
                    </Link>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newEquipment}>
                        <OpenInNew style={this.iconStyle} />
                    </IconButton>
                </Tooltip>
            </div>
        );
    }


    render() {
        if (this.props.renderOption === 'MENUITEMS') {
            return this.renderMenuItems()
        } else if (this.props.renderOption === 'TOOLBARICONS') {
            return this.renderToolbarIconsRow();
        } else {
            return (
                <div/>
            )
        }
    }

}

export default EquipmentToolbar
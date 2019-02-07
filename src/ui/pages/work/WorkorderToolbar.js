import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import '../../../ui/components/EamlightToolbar.css'
import Divider from '@material-ui/core/Divider';
import {ContentCopy, EmailOutline, Printer, Map, OpenInNew, Domain} from 'mdi-material-ui'

class WorkorderToolbar {

    state = {
        open: false,
    };

    toolbarIconsStyle = {
        width: "100%",
        alignItems: "center",
        display: "flex"
    }

    iconStyle = {
        width: 20,
        height: 20
    }

    iconMenuStyle = {
        marginRight: 5,
        width: 20,
        height: 20
    };

    verticalLineStyle = {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    }

    constructor(workorder, postInit, setLayout, newWorkorder, applicationData, screencode) {
        this.workorder = workorder;
        this.postInit = postInit;
        this.setLayout = setLayout;
        this.newWorkorder = newWorkorder
        this.applicationData = applicationData
        this.screencode = screencode
    }

    copyWorkorderHandler() {
        this.setLayout({newEntity: true});
        this.postInit();
    }

    emailWorkorderHandler() {
        window.open("mailto:?Subject=Work Order Number " + this.workorder.number + "&body=http://www.cern.ch/eam-light/work-order/" + this.workorder.number, '_self');
    }

    printWorkOrderHandler() {
        let url = this.applicationData.printingLinkToAIS + this.workorder.number;
        let w = window.open(url, "winLov", "Scrollbars=1,resizable=1");
        if (w.opener == null) {
            w.opener = window.self;
        }
        w.focus();
    }

    showOnMapWorkOrderHandler() {
        window.open(this.applicationData.gisprocedureLinkWO + this.workorder.number, '_blank');
    }

    showInExtendedHandler() {
        const extendedLink = this.applicationData.extendedWOLink.replace("&1", this.screencode).replace("&2", this.workorder.number);
        window.open(extendedLink, '_blank');
    }

    OSVCHandler() {
        const osvcLink = this.applicationData.linkToEAMIntegration + "/osvc.xhtml?workordernum=" + this.workorder.number;
        window.open(osvcLink, '_blank');
    }

    renderMenuItems() {
        return (
           <div >
               <Divider/>
                <MenuItem onClick={this.copyWorkorderHandler.bind(this)} disabled={this.newWorkorder}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div > Copy Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.emailWorkorderHandler.bind(this)} disabled={this.newWorkorder}>
                    <EmailOutline style={this.iconMenuStyle} />
                    <div >Email Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.printWorkOrderHandler.bind(this)} disabled={this.newWorkorder}>
                    <Printer style={this.iconMenuStyle} />
                    <div >Print Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.showOnMapWorkOrderHandler.bind(this)} disabled={this.newWorkorder}>
                    <Map style={this.iconMenuStyle} />
                    <div >Show on Map</div>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.newWorkorder}>
                    <OpenInNew style={this.iconMenuStyle} />
                    <div >Show in Infor EAM</div>
                </MenuItem>
                <MenuItem onClick={this.OSVCHandler.bind(this)} disabled={this.newWorkorder}>
                    <Domain style={this.iconMenuStyle} />
                    <div >OSVC</div>
                </MenuItem>
           </div>
        );
    }

    renderToolbarIconsRow() {
        return (
            <div style={this.toolbarIconsStyle}>
                <div style={this.verticalLineStyle}/>
                <Tooltip title="Copy Work Order">
                    <IconButton onClick={this.copyWorkorderHandler.bind(this)} disabled={this.newWorkorder}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Email Work Order">
                    <IconButton onClick={this.emailWorkorderHandler.bind(this)} disabled={this.newWorkorder}>
                        <EmailOutline style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Print Work Order">
                    <IconButton onClick={this.printWorkOrderHandler.bind(this)} disabled={this.newWorkorder}>
                        <Printer style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show on Map">
                    <IconButton onClick={this.showOnMapWorkOrderHandler.bind(this)} disabled={this.newWorkorder}>
                        <Map style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.newWorkorder}>
                        <OpenInNew style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="OSVC">
                    <IconButton onClick={this.OSVCHandler.bind(this)} disabled={this.newWorkorder}>
                        <Domain style={this.iconStyle} />
                    </IconButton>
                </Tooltip>
            </div>
        );
    }
}

export default WorkorderToolbar
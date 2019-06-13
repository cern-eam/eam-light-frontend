import React, {Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import '../../../ui/components/EamlightToolbar.css'
import Divider from '@material-ui/core/Divider';
import {ContentCopy, EmailOutline, Printer, Map, OpenInNew, Domain, Camera} from 'mdi-material-ui'

class WorkorderToolbar extends Component {

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

    copyWorkorderHandler() {
        this.props.setLayout({newEntity: true});
        this.props.postInit();
    }

    emailWorkorderHandler() {
        window.open("mailto:?Subject=Work Order Number " + this.props.workorder.number + "&body=http://www.cern.ch/eam-light/work-order/" + this.props.workorder.number, '_self');
    }

    printWorkOrderHandler() {
        let url = this.props.applicationData.EL_PRTWO + this.props.workorder.number;
        let w = window.open(url, "winLov", "Scrollbars=1,resizable=1");
        if (w.opener == null) {
            w.opener = window.self;
        }
        w.focus();
    }

    showOnMapWorkOrderHandler() {
        window.open(this.props.applicationData.EL_GISWO + this.props.workorder.number, '_blank');
    }

    showInExtendedHandler() {
        const extendedLink = this.props.applicationData.EL_WOLIN.replace("&1", this.props.screencode).replace("&2", this.props.workorder.number);
        window.open(extendedLink, '_blank');
    }

    OSVCHandler() {
        const osvcLink = this.props.applicationData.EL_INTEG + "/osvc.xhtml?workordernum=" + this.props.workorder.number;
        window.open(osvcLink, '_blank');
    }

    dismacHandler() {
        const dismacLink = this.props.applicationData.EL_DMURL.replace('{{workOrderId}}', this.props.workorder.number);
        window.open(dismacLink, '_blank');
    }

    isDismacVisible() {
        return this.props.applicationData.EL_DMUSG.includes(this.props.userGroup);
    }

    renderMenuItems() {
        return (
           <div >
               <Divider/>
                <MenuItem onClick={this.copyWorkorderHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div > Copy Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.emailWorkorderHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <EmailOutline style={this.iconMenuStyle} />
                    <div >Email Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.printWorkOrderHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <Printer style={this.iconMenuStyle} />
                    <div >Print Work Order</div>
                </MenuItem>
                <MenuItem onClick={this.showOnMapWorkOrderHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <Map style={this.iconMenuStyle} />
                    <div >Show on Map</div>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <OpenInNew style={this.iconMenuStyle} />
                    <div >Show in Infor EAM</div>
                </MenuItem>
                <MenuItem onClick={this.OSVCHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <Domain style={this.iconMenuStyle} />
                    <div >OSVC</div>
                </MenuItem>
                {this.isDismacVisible() &&
                <MenuItem onClick={this.dismacHandler.bind(this)} disabled={this.props.newWorkorder}>
                    <Camera style={this.iconMenuStyle} />
                    <div >DISMAC</div>
                </MenuItem>
                }
           </div>
        );
    }

    renderToolbarIconsRow() {
        return (
            <div style={this.toolbarIconsStyle}>
                <div style={this.verticalLineStyle}/>
                <Tooltip title="Copy Work Order">
                    <IconButton onClick={this.copyWorkorderHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Email Work Order">
                    <IconButton onClick={this.emailWorkorderHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <EmailOutline style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Print Work Order">
                    <IconButton onClick={this.printWorkOrderHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <Printer style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show on Map">
                    <IconButton onClick={this.showOnMapWorkOrderHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <Map style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <OpenInNew style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="OSVC">
                    <IconButton onClick={this.OSVCHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <Domain style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                {this.isDismacVisible() &&
                <Tooltip title="DISMAC">
                    <IconButton onClick={this.dismacHandler.bind(this)} disabled={this.props.newWorkorder}>
                        <Camera style={this.iconStyle} />
                    </IconButton>
                </Tooltip>
                }

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

export default WorkorderToolbar
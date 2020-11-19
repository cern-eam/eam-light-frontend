import React, {Component} from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import {Barcode, ContentCopy, EmailOutline} from 'mdi-material-ui';

class PartToolbar extends Component {

    divStyle = {
        width: "100%",
        display: "flex",
        alignItems: "center"
    };

    iconStyle = {
        width: 20,
        height: 20
    };

    iconMenuStyle = {
        marginRight: 5,
        width: 20
    };

    toolbarIconsStyle = {
        alignItems: "center",
        display: "flex"
    };

    verticalLineStyle = {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    };

    menuLabelStyle = {
        margin: 5
    };

    emailPartHandler() {
        window.open("mailto:?Subject=Part Code " + this.props.part.code + "&body=http://www.cern.ch/eam-light/part/" + this.props.part.code, '_self');
    }

    showInExtendedHandler() {
        const extendedLink = this.props.applicationData.EL_PARTL.replace("&1", this.props.screencode).replace("&2", this.props.part.code);
        window.open(extendedLink, '_blank');
    }

    printBarcodeHandler = () => {
        const barcodingLink = this.props.applicationData.EL_BCUR
            .replace("&1", this.props.screencode)
            .replace("&2", 'partcode')
            .replace("&3", this.props.part.code);

        window.open(barcodingLink, '_blank');
    }

    renderMenuItems() {
        return (
            <div >
                <Divider/>
                <MenuItem onClick={this.props.copyHandler} disabled={this.props.newPart}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}> Copy Part</div>
                </MenuItem>
                <MenuItem onClick={this.emailPartHandler.bind(this)} disabled={this.props.newPart}>
                    <EmailOutline style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}>Email Part</div>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newPart}>
                    <OpenInNewIcon style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Show in Infor EAM</div>
                </MenuItem>
                <MenuItem onClick={this.printBarcodeHandler} disabled={this.props.newPart}>
                    <Barcode style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Print Barcode</div>
                </MenuItem>
            </div>
        );
    }

    renderToolbarIconsRow() {
        return (
            <div style={this.toolbarIconsStyle}>
                <div style={this.verticalLineStyle}/>
                <Tooltip title="Copy Part" >
                    <IconButton onClick={this.props.copyHandler} disabled={this.props.newPart}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="E-Mail Part" >
                    <IconButton onClick={this.emailPartHandler.bind(this)} disabled={this.props.newPart}>
                        <EmailOutline style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.props.newPart}>
                        <OpenInNewIcon style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Print Barcode">
                    <IconButton onClick={this.printBarcodeHandler} disabled={this.props.newPart}>
                        <Barcode style={this.iconStyle} />
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

export default PartToolbar
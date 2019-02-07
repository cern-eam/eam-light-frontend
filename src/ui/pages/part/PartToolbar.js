import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import {ContentCopy, EmailOutline, OpenInNew, Barcode} from 'mdi-material-ui';
import WSParts from '../../../tools/WSParts';

class PartToolbar {

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
        width: "100%",
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

    constructor(part, postInit, setLayout, newPart, applicationData, screencode, handleError, showNotification, showError) {
        this.part = part;
        this.postInit = postInit;
        this.setLayout = setLayout;
        this.newPart = newPart;
        this.applicationData = applicationData;
        this.screencode = screencode;
        this.handleError = handleError;
        this.showNotification = showNotification;
        this.showError = showError;
    }

    copyPartHandler() {
        this.setLayout({newEntity: true});
        this.postInit();
    }

    emailPartHandler() {
        window.open("mailto:?Subject=Part Code " + this.part.code + "&body=http://www.cern.ch/eam-light/part/" + this.part.code, '_self');
    }

    showInExtendedHandler() {
        const extendedLink = this.applicationData.extendedPartLink.replace("&1", this.screencode).replace("&2", this.part.code);
        window.open(extendedLink, '_blank');
    }

    printBarcode() {
        let {userDefinedFields, customField, code, fields, ...partFields} = this.part;
        // expand custom fields
        customField.forEach( f => partFields[f.code] = f.value );
        // expand user defined fields
        partFields = { ...partFields, ...userDefinedFields };
        let barcodeInput = {
          type: 'P', // Set print for PARTS
          variables: [{
              code: this.part.code, // Send info for main code to print
              // Send all fields of part so labels may be created out of any available field
              fields: partFields
          }]
        };
        WSParts.printBarcode.bind(WSParts)(barcodeInput)
            .then(response => {
                this.showNotification(response.body.data);
            })
            .catch(error => {
                if (error && error.response && error.response.body) {
                    this.showError(error.response.body.data);
                }
                this.handleError(error);
            });
    }

    renderMenuItems() {
        return (
            <div >
                <Divider/>
                <MenuItem onClick={this.copyPartHandler.bind(this)} disabled={this.newPart}>
                    <ContentCopy style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}> Copy Part</div>
                </MenuItem>
                <MenuItem onClick={this.emailPartHandler.bind(this)} disabled={this.newPart}>
                    <EmailOutline style={this.iconMenuStyle}/>
                    <div style={this.menuLabelStyle}>Email Part</div>
                </MenuItem>
                <MenuItem onClick={this.showInExtendedHandler.bind(this)} disabled={this.newPart}>
                    <OpenInNew style={this.iconMenuStyle} />
                    <div style={this.menuLabelStyle}>Show in Infor EAM</div>
                </MenuItem>
                <MenuItem onClick={this.printBarcode.bind(this)} disabled={this.newPart}>
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
                    <IconButton onClick={this.copyPartHandler.bind(this)} disabled={this.newPart}>
                        <ContentCopy style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="E-Mail Part" >
                    <IconButton onClick={this.emailPartHandler.bind(this)} disabled={this.newPart}>
                        <EmailOutline style={this.iconStyle}/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton onClick={this.showInExtendedHandler.bind(this)} disabled={this.newPart}>
                        <OpenInNew style={this.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Print Barcode">
                    <IconButton onClick={this.printBarcode.bind(this)} disabled={this.newPart}>
                        <Barcode style={this.iconStyle} />
                    </IconButton>
                </Tooltip>
            </div>
        );
    }

}

export default PartToolbar
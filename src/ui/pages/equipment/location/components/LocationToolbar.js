import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { WorkorderIcon } from "eam-components/dist/ui/components/icons";
import Divider from "@material-ui/core/Divider";
import { ContentCopy, EmailOutline, Map, OpenInNew } from "mdi-material-ui";
import { withStyles } from "@material-ui/core";


const styles = (theme) => ({
    iconStyle: {
        width: 20,
        height: 20
    },
    iconMenuStyle: {
        marginRight: 5,
        width: 20,
        height: 20
    },
    toolbarIconsStyle: {
        alignItems: "center",
        display: "flex"
    },
    verticalLineStyle: {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    },
    createWorkOrderStyle: {
        display: "flex",
        color: "black",
        alignItems: "center",
        textDecoration: "none"
    }
})

const LocationToolbar = props => {
    const {
        setLayout,
        postInit,
        entityDesc,
        equipment,
        applicationData,
        extendedLink,
        screencode,
        newEquipment,
        renderOption,
        classes
    } = props;

    const copyEquipmentHandler = () => {
        setLayout({ newEntity: true });
        postInit();
    };

    const emailEquipmentHandler = () => {
        window.open(
            "mailto:?Subject=" +
                entityDesc +
                " Code " +
                equipment.code +
                "&body=http://www.cern.ch/eam-light/equipment/" +
                equipment.code,
            "_self"
        );
    };

    const showOnMapHandler = () => {
        window.open(applicationData.EL_GISEQ + equipment.code, "_blank");
    };

    const showInExtendedHandler = () => {
        const extendedLinkComplete = extendedLink
            .replace("&1", screencode)
            .replace("&2", equipment.code);
        window.open(extendedLinkComplete, "_blank");
    };

    const renderMenuItems = () => {
        return (
            <div>
                <Divider />
                <MenuItem
                    onClick={copyEquipmentHandler}
                    disabled={newEquipment}
                >
                    <ContentCopy className={classes.iconMenuStyle} />
                    <div>Copy {entityDesc}</div>
                </MenuItem>
                <MenuItem
                    onClick={emailEquipmentHandler}
                    disabled={newEquipment}
                >
                    <EmailOutline className={classes.iconMenuStyle} />
                    <div>Email {entityDesc}</div>
                </MenuItem>
                <MenuItem onClick={showOnMapHandler} disabled={newEquipment}>
                    <Map className={classes.iconMenuStyle} />
                    <div>Show on Map</div>
                </MenuItem>
                <MenuItem disabled={newEquipment}>
                    <Link
                        to={"/workorder?equipmentcode=" + equipment.code}
                        className={classes.createWorkOrderStyle}
                    >
                        <WorkorderIcon className={classes.iconStyle} />
                        <div>Create new WO</div>
                    </Link>
                </MenuItem>
                <MenuItem
                    onClick={showInExtendedHandler}
                    disabled={newEquipment}
                >
                    <OpenInNew className={classes.iconMenuStyle} />
                    <div>Show in Infor EAM</div>
                </MenuItem>
            </div>
        );
    };

    const renderToolbarIconsRow = () => {
        return (
            <div className={classes.toolbarIconsStyle}>
                <div className={classes.verticalLineStyle} />
                <Tooltip title={"Copy " + entityDesc}>
                    <IconButton
                        onClick={copyEquipmentHandler.bind(this)}
                        disabled={newEquipment}
                    >
                        <ContentCopy className={classes.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title={"E-Mail " + entityDesc}>
                    <IconButton
                        onClick={emailEquipmentHandler.bind(this)}
                        disabled={newEquipment}
                    >
                        <EmailOutline className={classes.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Show on Map">
                    <IconButton
                        onClick={showOnMapHandler.bind(this)}
                        disabled={newEquipment}
                    >
                        <Map className={classes.iconStyle} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Create Work Order">
                    <Link
                        to={"/workorder?equipmentcode=" + equipment.code}
                        className={classes.createWorkOrderStyle}
                    >
                        <IconButton disabled={newEquipment}>
                            <WorkorderIcon className={classes.iconStyle} />
                        </IconButton>
                    </Link>
                </Tooltip>

                <Tooltip title="Show in Infor EAM">
                    <IconButton
                        onClick={showInExtendedHandler.bind(this)}
                        disabled={newEquipment}
                    >
                        <OpenInNew className={classes.iconStyle} />
                    </IconButton>
                </Tooltip>
            </div>
        );
    };

    switch (renderOption) {
        case "MENUITEMS":
            return renderMenuItems();
        case "TOOLBARICONS":
            return renderToolbarIconsRow();
        default:
            return null;
    }
};

export default withStyles(styles)(LocationToolbar);

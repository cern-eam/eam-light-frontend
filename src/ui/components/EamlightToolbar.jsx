import "./EamlightToolbar.css";
import React, { Component } from "react";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import TelevisionGuide from "mdi-material-ui/TelevisionGuide";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationDialog from "./ConfirmationDialog";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon from "@mui/material/SvgIcon";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Toolbar from "./Toolbar";
import Divider from "@mui/material/Divider";
import { isMultiOrg } from "@/ui/pages/EntityTools";

const verticalLineStyle = {
  height: 25,
  borderRight: "1px solid gray",
  margin: 5,
};

const SMALL_SCREEN_MODE_MAX_WIDTH = 375;

class EamlightToolbar extends Component {
  state = {
    open: false,
    compactMenu: false,
    smallScreenMode: false,
  };

  iconMenuStyle = {
    marginRight: 5,
    width: 20,
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions(event) {
    if (this.entityToolbarDiv) {
      this.setState({
        compactMenu: this.entityToolbarDiv.clientWidth < this.props.width,
        smallScreenMode:
          this.entityToolbarDiv.clientWidth < SMALL_SCREEN_MODE_MAX_WIDTH,
      });
    }
  }

  deleteHandler = () => {
    this.setState({ open: true });
  };

  newHandler = () => {
    if (this.props.isModified) {
      this.newConfirmation.show();
    } else {
      this.props.newHandler();
    }
  };

  handleClose = (deleteEntity) => {
    if (deleteEntity === true) {
      this.props.deleteHandler();
    }
    this.setState({ open: false });
  };

  isSaveButtonDisabled() {
    const { newEntity, entityScreen, readOnly } = this.props;

    if (!entityScreen) {
      return true;
    }

    return (
      (!newEntity && !entityScreen.updateAllowed) ||
      (newEntity && !entityScreen.creationAllowed) ||
      readOnly
    );
  }

  isNewButtonDisabled() {
    const { entityScreen } = this.props;

    if (!entityScreen) {
      return true;
    }

    return !entityScreen.creationAllowed;
  }

  isDeleteButtonDisabled() {
    const { newEntity, entityScreen, readOnly } = this.props;

    if (!entityScreen) {
      return true;
    }

    return newEntity || !entityScreen.deleteAllowed || readOnly;
  }

  //
  // MORE MENU HANDLERS
  //
  handleMoreMenuClose() {
    if (this.state.moreMenu) {
      this.setState({ moreMenu: null });
    }
  }

  handleMoreMenuClick(e) {
    this.setState({ moreMenu: e.currentTarget });
  }

  //
  // VISIBILITY MENU HANDLERS
  //
  handleVisibilityMenuClose() {
    if (this.state.visibilityMenu) {
      this.setState({ visibilityMenu: null });
    }
  }

  handleVisibilityMenuClick(e) {
    this.setState({ visibilityMenu: e.currentTarget });
  }

  //
  //
  //
  getRegions = () => {
    const { regions, toggleHiddenRegion, getUniqueRegionID, isHiddenRegion } =
      this.props;
    return regions
      .filter((region) => !region.ignore)
      .map((region) => (
        <MenuItem
          key={region.id}
          onClick={() => toggleHiddenRegion(getUniqueRegionID(region.id))}
        >
          <Checkbox disabled checked={!isHiddenRegion(region.id)} />
          {region.label}
        </MenuItem>
      ));
  };

  //
  //
  //

  renderPanelSelectorMenu = (isInsideAMenu = false) => {
    return (
      <div style={{ flexGrow: "1" }}>
        {isInsideAMenu && <Divider />}
        <IconButton
          aria-label="More"
          aria-owns={this.state.visibilityMenu ? "simple-menu" : null}
          onClick={this.handleVisibilityMenuClick.bind(this)}
          size="large"
        >
          <TelevisionGuide
            style={
              isInsideAMenu ? { width: 18, marginRight: -5, marginLeft: 5 } : {}
            }
          />
        </IconButton>
        {isInsideAMenu && <span>Panel Selector</span>}
        <Menu
          id="simple-menu"
          anchorEl={this.state.visibilityMenu}
          open={Boolean(this.state.visibilityMenu)}
          onClose={this.handleVisibilityMenuClose.bind(this)}
        >
          {this.getRegions()}
        </Menu>
      </div>
    );
  };

  renderPanelSelector = () => {
    const { entityScreen, isLocalAdministrator } = this.props;

    return (
      <>
        {isLocalAdministrator && (
          <>
            <span
              className="screen-code"
              style={{
                marginRight: 5,
                color: "#ccc",
                fontWeight: "lighter",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: "0px",
              }}
            >
              {entityScreen.screenCode}
            </span>
            {!this.state.smallScreenMode && (
              <div style={{ ...verticalLineStyle, borderRightColor: "#ccc" }} />
            )}
          </>
        )}
        {this.props.regions && this.renderPanelSelectorMenu()}
      </>
    );
  };

  renderCompactMenu() {
    //this.props.entityToolbar.props.renderOption = 'MENUITEMS'
    return (
      <div style={{ display: "flex" }}>
        <Button
          style={{ padding: 8, minWidth: "unset" }}
          aria-label="More"
          aria-owns={this.state.moreMenu ? "long-menu" : null}
          onClick={this.handleMoreMenuClick.bind(this)}
        >
          MORE
          <SvgIcon style={{ color: "rgba(0, 0, 0, 0.54)" }}>
            <path d="M7 10l5 5 5-5z" />
          </SvgIcon>
        </Button>
        <Menu
          id="long-menu"
          anchorEl={this.state.moreMenu}
          open={Boolean(this.state.moreMenu)}
          onClose={this.handleMoreMenuClose.bind(this)}
        >
          <MenuItem
            onClick={this.newHandler}
            disabled={this.isNewButtonDisabled()}
          >
            <AddIcon className="iconButton" style={this.iconMenuStyle} />
            <div style={this.menuLabelStyle}> New</div>
          </MenuItem>
          <MenuItem
            onClick={() => this.deleteConfirmation.show()}
            disabled={this.isDeleteButtonDisabled()}
          >
            <DeleteOutlineIcon
              className="iconButton"
              style={this.iconMenuStyle}
            />
            <div style={this.menuLabelStyle}> Delete</div>
          </MenuItem>
          {this.getToolbar("MENUITEMS")}
          {this.state.smallScreenMode &&
            this.props.regions &&
            this.renderPanelSelectorMenu(true)}
        </Menu>
      </div>
    );
  }

  getToolbar = (renderOption) => (
    <Toolbar
      {...this.props.toolbarProps}
      renderOption={renderOption}
      userCode={this.props.userCode}
    />
  );

  renderDesktopMenu() {
    return (
      <div style={{ display: "flex", height: 36 }}>
        <Button
          onClick={this.newHandler}
          disabled={this.isNewButtonDisabled()}
          startIcon={<AddIcon />}
        >
          New
        </Button>
        <Button
          onClick={() => this.deleteConfirmation.show()}
          disabled={this.isDeleteButtonDisabled()}
          startIcon={<DeleteOutlineIcon />}
        >
          Delete
        </Button>
        {this.getToolbar("TOOLBARICONS")}
      </div>
    );
  }

  render() {
    const entityCodeStyle = {
      marginLeft: 12,
      marginRight: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    };

    return (
      <div
        className={"entityToolbar"}
        ref={(entityToolbarDiv) => (this.entityToolbarDiv = entityToolbarDiv)}
      >
        <div className={"entityToolbarContent"}>
          <div
            style={
              this.state.compactMenu
                ? { ...entityCodeStyle, flexBasis: "8em", flexShrink: "0" }
                : entityCodeStyle
            }
          >
            <div
              style={{ display: "flex", alignItems: "center", marginRight: 5 }}
            >
              {!this.state.compactMenu && this.props.entityIcon}
              <span style={{ marginLeft: 5 }}>{this.props.entityName}</span>
            </div>
            <div>
              {!this.props.newEntity && (
                <span style={{ fontWeight: 900 }}>
                  {" "}
                  {this.props.entityKeyCode}
                </span>
              )}
              {!this.props.newEntity &&
                isMultiOrg &&
                this.props.organization && (
                  <span style={{ color: "#737373" }}>
                    {" "}
                    {this.props.organization}
                  </span>
                )}
            </div>
          </div>

          <div style={verticalLineStyle} />

          <Button
            onClick={this.props.saveHandler}
            disabled={this.isSaveButtonDisabled()}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>

          {this.state.compactMenu
            ? this.renderCompactMenu()
            : this.renderDesktopMenu()}
        </div>

        <div className={"entityToolbarContent"} style={{ minWidth: 0 }}>
          {!this.state.smallScreenMode && this.renderPanelSelector()}
        </div>

        <ConfirmationDialog
          ref={(deleteConfirmation) =>
            (this.deleteConfirmation = deleteConfirmation)
          }
          onConfirm={this.props.deleteHandler}
          title={"Delete " + this.props.entityName + "?"}
          content={
            "Are you sure you would like to delete this " +
            this.props.entityName +
            "?"
          }
          confirmButtonText="Delete"
        />

        <ConfirmationDialog
          ref={(newConfirmation) => (this.newConfirmation = newConfirmation)}
          onConfirm={this.props.newHandler}
          title={"New " + this.props.entityName + "?"}
          content={
            "Are you sure you would like to proceed without saving the changes?"
          }
          confirmButtonText="Proceed"
        />
      </div>
    );
  }
}

export default EamlightToolbar;

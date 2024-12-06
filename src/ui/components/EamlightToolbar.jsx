import useUserDataStore from "../../state/useUserDataStore";
import { isMultiOrg } from "@/ui/pages/EntityTools";
import Button from "@mui/material/Button";
import ConfirmationDialog from "./ConfirmationDialog";
import SaveIcon from "@mui/icons-material/Save";
import { useCallback, useMemo, useRef, useState } from "react";
import queryString from "query-string";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TelevisionGuide from "mdi-material-ui/TelevisionGuide";
import Menu from "@mui/material/Menu";
import SvgIcon from "@mui/material/SvgIcon";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Toolbar from "./Toolbar";
import "./EamlightToolbar.css";


const EamlightToolbar = ({
  regions,
  setRegionVisibility,
  getUniqueRegionID,
  isHiddenRegion,
  entityScreen,
  isLocalAdministrator,
  isModified,
  newHandler,
  newEntity,
  readOnly,
  entityIcon,
  entityName,
  entityKeyCode,
  organization,
  saveHandler,
  deleteHandler,
  toolbarProps,
}) => {
  const [compactMenu, setCompactMenu] = useState(false);
  const [smallScreenMode, setSmallScreenMode] = useState(false);
  const [moreMenu, setMoreMenu] = useState(null);
  const [visibilityMenu, setVisibilityMenu] = useState(null);

  const {
    userData: {
      eamAccount: { userCode },
    },
  } = useUserDataStore();

  const hideEntityMenu = useMemo(
    () =>
      queryString.parse(window.location.search)["hideEntityMenu"] === "true",
    []
  );

  if (hideEntityMenu) return <></>;

  const newConfirmation = useRef();
  const deleteConfirmation = useRef();

  const localNewHandler = useCallback(
    () => (isModified ? newConfirmation.current.show() : newHandler()),

    [isModified, newHandler]
  );

  const isSaveButtonDisabled = useMemo(() => {
    if (!entityScreen) return true;

    return (
      (!newEntity && !entityScreen.updateAllowed) ||
      (newEntity && !entityScreen.creationAllowed) ||
      readOnly
    );
  }, [newEntity, entityScreen, readOnly]);

  const isNewButtonDisabled = useMemo(() => {
    if (!entityScreen) return true;
    return !entityScreen.creationAllowed;
  }, [entityScreen]);

  const isDeleteButtonDisabled = useMemo(() => {
    if (!entityScreen) return true;

    return newEntity || !entityScreen.deleteAllowed || readOnly;
  }, [newEntity, entityScreen, readOnly]);

  const getRegions = () => {
    return regions
      .filter((region) => !region.ignore)
      .map((region) => (
        <MenuItem
          key={region.id}
          onClick={() =>
            setRegionVisibility(
              getUniqueRegionID(region.id),
              !isHiddenRegion(region.id)
            )
          }
        >
          <Checkbox disabled checked={!isHiddenRegion(region.id)} />
          {region.label}
        </MenuItem>
      ));
  };

  const renderPanelSelectorMenu = (isInsideAMenu = false) => {
    return (
      <div style={{ flexGrow: "1" }}>
        {isInsideAMenu && <Divider />}
        <IconButton
          aria-label="More"
          aria-owns={visibilityMenu ? "simple-menu" : null}
          onClick={(e) => setVisibilityMenu(e.currentTarget)}
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
          anchorEl={visibilityMenu}
          open={Boolean(visibilityMenu)}
          onClose={() => visibilityMenu && setVisibilityMenu(null)}
        >
          {getRegions()}
        </Menu>
      </div>
    );
  };

  const renderPanelSelector = () => {
    return (
      <>
        {isLocalAdministrator && (
          <>
            <span
              className="screen-code-constant screen-code-max-width"
            >
              {entityScreen.screenCode}
            </span>
            {!smallScreenMode && (
              <div className="verticalLineStyle" style={{ borderRightColor: "#ccc" }} />
            )}
          </>
        )}
        {regions && renderPanelSelectorMenu()}
      </>
    );
  };

  const getToolbar = (renderOption) => (
    <Toolbar
      {...toolbarProps}
      renderOption={renderOption}
      userCode={userCode}
    />
  );

  const renderCompactMenu = () => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          style={{ padding: 8, minWidth: "unset" }}
          aria-label="More"
          aria-owns={moreMenu ? "long-menu" : null}
          onClick={(e) => setMoreMenu(e.currentTarget)}
        >
          MORE
          <SvgIcon style={{ color: "rgba(0, 0, 0, 0.54)" }}>
            <path d="M7 10l5 5 5-5z" />
          </SvgIcon>
        </Button>
        <Menu
          id="long-menu"
          anchorEl={moreMenu}
          open={Boolean(moreMenu)}
          onClose={() => moreMenu && setMoreMenu(null)}
        >
          <MenuItem onClick={localNewHandler} disabled={isNewButtonDisabled}>
            <AddIcon className="iconButton iconMenuStyle" />
            <div> New</div>
          </MenuItem>
          <MenuItem
            onClick={() => deleteConfirmation.current.show()}
            disabled={isDeleteButtonDisabled}
          >
            <DeleteOutlineIcon className="iconButton iconMenuStyle" />
            <div> Delete</div>
          </MenuItem>
          {getToolbar("MENUITEMS")}
          {smallScreenMode && regions && renderPanelSelectorMenu(true)}
        </Menu>
      </div>
    );
  };

  const renderDesktopMenu = () => {
    return (
      <div style={{ display: "flex", height: 36 }}>
        <Button
          onClick={localNewHandler}
          disabled={isNewButtonDisabled}
          startIcon={<AddIcon />}
        >
          New
        </Button>
        <Button
          onClick={() => deleteConfirmation.current.show()}
          disabled={isDeleteButtonDisabled}
          startIcon={<DeleteOutlineIcon />}
        >
          Delete
        </Button>
        {getToolbar("TOOLBARICONS")}
      </div>
    );
  };

  return (
    <div className={"entityToolbar"}>
      <div className={"entityToolbarContent"}>
        <div
          className="entityCodeStyle"
          style={compactMenu
              ? { flexBasis: "8em", flexShrink: "0" }
              : {}
          }
        >
          <div
            style={{ display: "flex", alignItems: "center", marginRight: 5 }}
          >
            {!compactMenu && entityIcon}
            <span style={{ marginLeft: 5 }}>{entityName}</span>
          </div>
          <div>
            {!newEntity && (
              <span style={{ fontWeight: 900 }}> {entityKeyCode}</span>
            )}
            {!newEntity && isMultiOrg && organization && (
              <span style={{ color: "#737373" }}> {organization}</span>
            )}
          </div>
        </div>

        <div className="verticalLineStyle" />

        <Button
          onClick={saveHandler}
          disabled={isSaveButtonDisabled}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>

        {compactMenu ? renderCompactMenu() : renderDesktopMenu()}
      </div>

      <div className={"entityToolbarContent"} style={{ minWidth: 0 }}>
        {!smallScreenMode && renderPanelSelector()}
      </div>

      <ConfirmationDialog
        ref={deleteConfirmation}
        onConfirm={deleteHandler}
        title={"Delete " + entityName + "?"}
        content={
          "Are you sure you would like to delete this " + entityName + "?"
        }
        confirmButtonText="Delete"
      />

      <ConfirmationDialog
        ref={newConfirmation}
        onConfirm={newHandler}
        title={"New " + entityName + "?"}
        content={
          "Are you sure you would like to proceed without saving the changes?"
        }
        confirmButtonText="Proceed"
      />
    </div>
  );
};

export default EamlightToolbar;

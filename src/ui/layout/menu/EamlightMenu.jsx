import { Component } from "react";
import Tooltip from "@mui/material/Tooltip";
import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import MenuMyWorkorders from "./MenuMyWorkorders";
import MenuMyTeamWorkorders from "./MenuMyTeamWorkorders";
import MenuItem from "./MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatListBulletedTriangle from "mdi-material-ui/FormatListBulletedTriangle";
import EamlightSubmenu from "./EamlightSubmenu";
import SpeedometerIcon from "mdi-material-ui/Speedometer";
import AutorenewIcon from "mdi-material-ui/Autorenew";
import {
  AssetIcon,
  PartIcon,
  PositionIcon,
  SystemIcon,
  WorkorderIcon,
} from "eam-components/dist/ui/components/icons";
import {
  Account,
  AccountMultiple,
  Tune,
  DatabaseRefresh,
  Cog
} from "mdi-material-ui";
import ScreenChange from "./ScreenChange";
import MenuTools from "./MenuTools";
import RoomIcon from "@mui/icons-material/Room";
import BuildIcon from "@mui/icons-material/Build";
import Rule from '@mui/icons-material/Rule';
import CERNMode from "../../components/CERNMode";
import MenuLink from "./MenuLink";
import MenuItemInputHistory from "./MenuItemInputHistory";
import EISPanel from "@/ui/components/panel/Panel";
import useLayoutStore from "../../../state/useLayoutStore";
import useApplicationDataStore from "../../../state/useApplicationDataStore";
import useUserDataStore from "../../../state/useUserDataStore";
import NumberOfMyOpenWorkOrders from "./components/NumberOfMyWorkOrders";
import NumberOfMyTeamWorkOrders from "./components/NumberOfMyTeamWorkOrders";
import { TAB_CODES_ASSETS, TAB_CODES_LOCATIONS, TAB_CODES_PARTS, TAB_CODES_POSITIONS, TAB_CODES_SYSTEMS, TAB_CODES_WORK_ORDERS } from "../../components/entityregions/TabCodeMapping";
import useSnackbarStore from "../../../state/useSnackbarStore";

export const menuIconStyle = {
  display: "inline-block",
  marginRight: 5,
  color: "#f7ce03",
  width: "100%",
  height: 36,
};

export const menuIconStyleDisabled = {
  ...menuIconStyle,
  color: "#8b8c8b",
};

const getScreenHeaderFunction =
  (screens = {}) =>
  ({ screenName, screen, updateScreenLayout }) =>
    (
      <ScreenChange
        updateScreenLayout={updateScreenLayout}
        screen={screen}
        screens={Object.values(screens).filter(
          (screen) => screen.parentScreen === screenName
        )}
      />
    );

const EAM_REPORTS_MENU = "Lists & Reports";

const generateReportMenuLinks = (menusMetaData) =>
  menusMetaData?.map((metadata) => {
    if (["WEBD"].includes(metadata.classcode)) {
      const code = metadata.screencode;
      const link = "/grid?gridName=" + code;
      return (
        <MenuLink
          description={metadata.screendescription}
          link={link}
          key={code}
        />
      );
    } else if (metadata.classcode === "WEB") {
      const link = "/report?url=" + metadata.urlpath;
      return (
        <MenuLink
          description={metadata.screendescription}
          link={link}
          key={metadata.screencode}
        />
      );
    }
  });

class EamlightMenu extends Component {
  constructor(props) {
    super(props);
    this.mainMenuClickHandler = this.mainMenuClickHandler.bind(this);
    this.openSubMenu = this.openSubMenu.bind(this);
    this.applicationData = useApplicationDataStore.getState().applicationData;
    this.userData = useUserDataStore.getState().userData;
    this.setUserData = useUserDataStore.getState().setUserData;
    this.showError = useSnackbarStore.getState().showError;
    this.showNotification = useSnackbarStore.getState().showNotification;
  }

  mainMenuClickHandler(event) {
    // deactivate previous menu and submenu
    this.menudiv
      .querySelector("#layout-tab-menu li > div.active")
      .classList.remove("active");
    this.menudiv
      .querySelector("#menuscrollable > .layout-tab-submenu.active")
      .classList.remove("active");
    // activate current menu and submenu
    const rel = event.currentTarget.getAttribute("rel");
    event.currentTarget.classList.add("active");
    this.menudiv.querySelector("#" + rel).classList.add("active");

    // At the time of writing, this is required for the tab indicator on my team WOs to work
    // Identified in issue https://github.com/mui-org/material-ui/issues/9337
    // Fixed in material-ui on Aug 26th https://github.com/mui-org/material-ui/pull/27791
    if (["myteamwos", "mywos"].includes(rel)) {
      window.dispatchEvent(new CustomEvent("resize"));
    }
  }

  openSubMenu(rel) {
    // deactivate previous submenu
    this.menudiv
      .querySelector("#menuscrollable > .layout-tab-submenu.active")
      .classList.remove("active");
    // activate current submenu
    this.menudiv.querySelector("#" + rel).classList.add("active");
  }

  creationAllowed = (screens, screen) =>
    screen && screens[screen] && screens[screen].creationAllowed;

  readAllowed = (screens, screen) =>
    screen && screens[screen] && screens[screen].readAllowed;

  //
  // RENDER
  //
  render() {
    const iconStyles = {
      width: 22,
      height: 22,
      color: "white",
    };

    const {
      workOrderScreen,
      assetScreen,
      ncrScreen,
      positionScreen,
      systemScreen,
      partScreen,
      locationScreen,
      eamAccount,
      screens,
      reports,
    } = this.userData;

    const currentPartScreen = screens[partScreen] || {};
    const currentWorkOrderScreen = screens[workOrderScreen] || {};

    const screenProps = {
      workOrder: {
        screenName: "WSJOBS",
        updateScreenLayout: (screenCode) => this.setUserData({ workOrderScreen: screenCode }),
        screen: workOrderScreen,
      },
      asset: {
        screenName: "OSOBJA",
        updateScreenLayout: (screenCode) => this.setUserData({ assetScreen: screenCode }),
        screen: assetScreen,
      },
      ncr: {
        screenName: "OSNCHD",
        updateScreenLayout: (screenCode) => this.setUserData({ ncrScreen: screenCode }),
        screen: ncrScreen,
      },
      position: {
        screenName: "OSOBJP",
        updateScreenLayout: (screenCode) => this.setUserData({ positionScreen: screenCode }),
        screen: positionScreen,
      },
      system: {
        screenName: "OSOBJS",
        updateScreenLayout: (screenCode) => this.setUserData({ systemScreen: screenCode }),
        screen: systemScreen,
      },
      location: {
        screenName: "OSOBJL",
        updateScreenLayout: (screenCode) => this.setUserData({ locationScreen: screenCode }),
        screen: locationScreen,
      },
      part: {
        screenName: "SSPART",
        updateScreenLayout: (screenCode) => this.setUserData({ partScreen: screenCode }),
        screen: partScreen,
      },
    };
    

    const getScreenHeader = getScreenHeaderFunction(screens);

    return (
      <div
        id="menu"
        ref={(menudiv) => {
          this.menudiv = menudiv;
        }}
      >
        <div id="menuscrollable">
          <ul id="layout-tab-menu">
            <li>
              <div
                rel="mywos"
                className="active"
                onClick={this.mainMenuClickHandler}
              >
                <Tooltip title="MY OPEN WOs" placement="right">
                  <Account style={iconStyles} />
                </Tooltip>
                <NumberOfMyOpenWorkOrders/>
              </div>
            </li>

            <li>
              <div rel="myteamwos" onClick={this.mainMenuClickHandler}>
                <Tooltip title="MY TEAM's WOs" placement="right">
                  <AccountMultiple style={iconStyles} />
                </Tooltip>
                <NumberOfMyTeamWorkOrders/>
              </div>
            </li>

            {workOrderScreen && (
              <li>
                <div rel="workorders" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="WORK ORDERS" placement="right">
                    <WorkorderIcon style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}

            {(assetScreen ||
              positionScreen ||
              systemScreen ||
              ncrScreen ||
              locationScreen) && (
              <li>
                <div rel="equipment" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="EQUIPMENT" placement="right">
                    <Cog style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}

            {partScreen && (
              <li>
                <div rel="materials" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="MATERIALS" placement="right">
                    <PartIcon style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}

            {reports && (
              <li>
                <div rel="customgrids" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="LISTS & REPORTS" placement="right">
                    <FormatListBulletedTriangle style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}

            <li>
              <div rel="settings" onClick={this.mainMenuClickHandler}>
                <Tooltip title="SETTINGS" placement="right">
                  <Tune style={iconStyles} />
                </Tooltip>
              </div>
            </li>
          </ul>

          <MenuMyWorkorders/>

          <MenuMyTeamWorkorders
            eamAccount={eamAccount}
          />

          {workOrderScreen && (
            <EamlightSubmenu
              id="workorders"
              header={getScreenHeader(screenProps.workOrder)}
            >
              {currentWorkOrderScreen.creationAllowed && (
                <MenuItem
                  label="New Work Order"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="workorder"
                />
              )}

              {currentWorkOrderScreen.readAllowed && (
                <MenuItem
                  label={"Search " + currentWorkOrderScreen.screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}
            </EamlightSubmenu>
          )}

          {(assetScreen || positionScreen || systemScreen || ncrScreen) && (
            <EamlightSubmenu id="equipment" header={<span>EQUIPMENT</span>}>
              {assetScreen && (
                <MenuItem
                  label="Assets"
                  icon={<AssetIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "assets")}
                />
              )}

              {(eamAccount.userGroup === 'R5CERN') && ncrScreen && ( // Limit temporairly to R5CERN
                <MenuItem
                  label="NCRs"
                  icon={<Rule style={menuIconStyle} />} // TODO: Add NCR icon
                  onClick={this.openSubMenu.bind(this, "ncrs")}
                />
              )}

              {positionScreen && (
                <MenuItem
                  label="Positions"
                  icon={<PositionIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "positions")}
                />
              )}

              {systemScreen && (
                <MenuItem
                  label="Systems"
                  icon={<SystemIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "systems")}
                />
              )}

              {locationScreen && (
                <MenuItem
                  label="Locations"
                  icon={<RoomIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "locations")}
                />
              )}

              <CERNMode>
                {assetScreen && screens[assetScreen].updateAllowed && (
                  <MenuItem
                    label="Replace Equipment"
                    icon={<AutorenewIcon style={menuIconStyle} />}
                    link="replaceeqp"
                  />
                )}
              </CERNMode>

              <MenuItem
                label="Meter Reading"
                icon={<SpeedometerIcon style={menuIconStyle} />}
                link="meterreading"
              />

              <MenuItem
                label="Install / Detach Equipment"
                icon={<BuildIcon style={menuIconStyle} />}
                link="installeqp"
              />
            </EamlightSubmenu>
          )}

          {assetScreen && (
            <EamlightSubmenu
              id="assets"
              header={getScreenHeader(screenProps.asset)}
            >
              {this.creationAllowed(screens, assetScreen) && (
                <MenuItem
                  label="New Asset"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="asset"
                />
              )}

              {this.readAllowed(screens, assetScreen) && (
                <MenuItem
                  label={"Search " + screens[assetScreen].screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="assetsearch"
                />
              )}

              <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {ncrScreen && (
            <EamlightSubmenu id="ncrs">
              {this.creationAllowed(screens, ncrScreen) && (
                <MenuItem
                  label="New NCR"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="ncr"
                />
              )}

              {this.readAllowed(screens, ncrScreen) && (
                <MenuItem
                  label={"Search " + screens[ncrScreen].screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="ncrsearch"
                />
              )}

              <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {positionScreen && (
            <EamlightSubmenu
              id="positions"
              header={getScreenHeader(screenProps.position)}
            >
              {this.creationAllowed(screens, positionScreen) && (
                <MenuItem
                  label="New Position"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="position"
                />
              )}

              {this.readAllowed(screens, positionScreen) && (
                <MenuItem
                  label={"Search " + screens[positionScreen].screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="positionsearch"
                />
              )}

              <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {systemScreen && (
            <EamlightSubmenu
              id="systems"
              header={getScreenHeader(screenProps.system)}
            >
              {this.creationAllowed(screens, systemScreen) && (
                <MenuItem
                  label="New System"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="system"
                />
              )}

              {this.readAllowed(screens, systemScreen) && (
                <MenuItem
                  label={"Search " + screens[systemScreen].screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="systemsearch"
                />
              )}

              <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {locationScreen && (
            <EamlightSubmenu
              id="locations"
              header={getScreenHeader(screenProps.location)}
            >
              {this.readAllowed(screens, locationScreen) && (
                <MenuItem
                  label={"Search " + screens[locationScreen].screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="locationsearch"
                />
              )}

              <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {partScreen && (
            <EamlightSubmenu
              id="materials"
              header={getScreenHeader(screenProps.part)}
            >
              {currentPartScreen.creationAllowed && (
                <MenuItem
                  label="New Part"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="part"
                />
              )}

              {currentPartScreen.readAllowed && (
                <MenuItem
                  label={"Search " + currentPartScreen.screenDesc}
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="partsearch"
                />
              )}
            </EamlightSubmenu>
          )}

          {reports && (
            <EamlightSubmenu
              id="customgrids"
              header={<span>LISTS & REPORTS</span>}
            >
              {/* Render list in main menu */}
              <div>{generateReportMenuLinks(reports[EAM_REPORTS_MENU])}</div>

              {/* Render sub-menus */}
              {Object.entries(reports).map(([menuName, menusMetaData]) => {
                if (menuName !== EAM_REPORTS_MENU) {
                  return (
                    <EISPanel
                      heading={menuName}
                      key={menuName}
                      detailsStyle={{
                        backgroundColor: "#242021",
                      }}
                      summaryStyle={{
                        backgroundColor: "#242021",
                        color: "white",
                      }}
                    >
                      {generateReportMenuLinks(menusMetaData)}
                    </EISPanel>
                  );
                }
              })}
            </EamlightSubmenu>
          )}

          <EamlightSubmenu id="settings" header={<span>SETTINGS</span>}>
            {this.applicationData.EL_ADMUG &&
              this.applicationData.EL_ADMUG.split(",").includes(
                eamAccount.userGroup
              ) && (
                <MenuItem
                  label="Refresh EAM Light Cache"
                  icon={<DatabaseRefresh style={menuIconStyle} />}
                  onClick={MenuTools.refreshCache.bind(
                    null,
                    this.showNotification,
                    this.showError
                  )}
                />
              )}
            <MenuItemInputHistory />
          </EamlightSubmenu>
        </div>
      </div>
    );
  }
}

export default EamlightMenu;

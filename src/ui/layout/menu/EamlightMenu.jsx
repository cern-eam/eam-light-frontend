import Tooltip from "@mui/material/Tooltip";
import {
    Account,
    AccountMultiple,
    Tune,
    DatabaseRefresh,
    Cog,
} from "mdi-material-ui";
import NumberOfMyOpenWorkOrders from "./components/NumberOfMyWorkOrders";
import NumberOfMyTeamWorkOrders from "./components/NumberOfMyTeamWorkOrders";
import {
    AssetIcon,
    PartIcon,
    PositionIcon,
    SystemIcon,
    WorkorderIcon,
} from "eam-components/dist/ui/components/icons";
import FormatListBulletedTriangle from "mdi-material-ui/FormatListBulletedTriangle";
import MenuMyWorkorders from "./MenuMyWorkorders";
import MenuMyTeamWorkorders from "./MenuMyTeamWorkorders";
import EamlightSubmenu from "./EamlightSubmenu";
import MenuItem from "./MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RoomIcon from "@mui/icons-material/Room";
import SpeedometerIcon from "mdi-material-ui/Speedometer";
import CERNMode from "../../components/CERNMode";
import BuildIcon from "@mui/icons-material/Build";
import AutorenewIcon from "mdi-material-ui/Autorenew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EISPanel from "@/ui/components/panel/Panel";
import MenuItemInputHistory from "./MenuItemInputHistory";
import useUserDataStore from "../../../state/useUserDataStore";
import useApplicationDataStore from "../../../state/useApplicationDataStore";
import { useCallback, useMemo, useRef } from "react";
import MenuLink from "./MenuLink";
import MenuTools from "./MenuTools";
import Rule from "@mui/icons-material/Rule";
import ScreenChange from "./ScreenChangeOld";
import "../ApplicationLayout.css";
import "./EamlightMenu.css";

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

const iconStyles = {
    width: 22,
    height: 22,
    color: "white",
};

const EAM_REPORTS_MENU = "Lists & Reports";

const EamlightMenu = ({ showNotification, showError }) => {
    const { userData, setUserData } = useUserDataStore.getState();
    const { applicationData } = useApplicationDataStore.getState();
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
    } = userData;

    const menuDivRef = useRef(null);

    const currentPartScreen = useMemo(
        () => screens[partScreen] || {},
        [screens, partScreen]
    );
    const currentWorkOrderScreen = useMemo(
        () => screens[workOrderScreen] || {},
        [screens, workOrderScreen]
    );

    const screenProps = {
        workOrder: {
            screenName: "WSJOBS",
            updateScreenLayout: (screenCode) =>
                setUserData({ workOrderScreen: screenCode }),
            screen: workOrderScreen,
        },
        asset: {
            screenName: "OSOBJA",
            updateScreenLayout: (screenCode) =>
                setUserData({ assetScreen: screenCode }),
            screen: assetScreen,
        },
        ncr: {
            screenName: "OSNCHD",
            updateScreenLayout: (screenCode) =>
                setUserData({ ncrScreen: screenCode }),
            screen: ncrScreen,
        },
        position: {
            screenName: "OSOBJP",
            updateScreenLayout: (screenCode) =>
                setUserData({ positionScreen: screenCode }),
            screen: positionScreen,
        },
        system: {
            screenName: "OSOBJS",
            updateScreenLayout: (screenCode) =>
                setUserData({ systemScreen: screenCode }),
            screen: systemScreen,
        },
        location: {
            screenName: "OSOBJL",
            updateScreenLayout: (screenCode) =>
                setUserData({ locationScreen: screenCode }),
            screen: locationScreen,
        },
        part: {
            screenName: "SSPART",
            updateScreenLayout: (screenCode) =>
                setUserData({ partScreen: screenCode }),
            screen: partScreen,
        },
    };

    const mainMenuClickHandler = useCallback(
        (e) => {
            if (!menuDivRef.current) return;
            // deactivate previous menu and submenu
            menuDivRef.current
                .querySelector("#layout-tab-menu li > div.active")
                .classList.remove("active");
            menuDivRef.current
                .querySelector("#menuscrollable > .layout-tab-submenu.active")
                .classList.remove("active");
            // activate current menu and submenu
            const rel = e.currentTarget.getAttribute("rel");
            e.currentTarget.classList.add("active");
            menuDivRef.current.querySelector("#" + rel).classList.add("active");

            // At the time of writing, this is required for the tab indicator on my team WOs to work
            // Identified in issue https://github.com/mui-org/material-ui/issues/9337
            // Fixed in material-ui on Aug 26th https://github.com/mui-org/material-ui/pull/27791
            if (["myteamwos", "mywos"].includes(rel)) {
                window.dispatchEvent(new CustomEvent("resize"));
            }
        },
        [menuDivRef]
    );

    const openSubMenu = useCallback(
        (rel) => {
            if (!menuDivRef.current) return;

            // deactivate previous submenu
            menuDivRef.current
                .querySelector("#menuscrollable > .layout-tab-submenu.active")
                .classList.remove("active");
            // activate current submenu
            menuDivRef.current.querySelector("#" + rel).classList.add("active");
        },
        [menuDivRef]
    );

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

    const creationAllowed = useCallback(
        (screens, screen) =>
            screen && screens[screen] && screens[screen].creationAllowed,
        []
    );

    const readAllowed = useCallback(
        (screens, screen) =>
            screen && screens[screen] && screens[screen].readAllowed,
        []
    );

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

    const getScreenHeader = getScreenHeaderFunction(screens);

    return (
        <div id="menu" ref={menuDivRef}>
            <div id="menuscrollable">
                <ul id="layout-tab-menu">
                    <li>
                        <div
                            rel="mywos"
                            className="active"
                            onClick={mainMenuClickHandler}
                        >
                            <Tooltip title="MY OPEN WOs" placement="right">
                                <Account style={iconStyles} />
                            </Tooltip>
                            <NumberOfMyOpenWorkOrders />
                        </div>
                    </li>

                    <li>
                        <div rel="myteamwos" onClick={mainMenuClickHandler}>
                            <Tooltip title="MY TEAM's WOs" placement="right">
                                <AccountMultiple style={iconStyles} />
                            </Tooltip>
                            <NumberOfMyTeamWorkOrders />
                        </div>
                    </li>

                    {workOrderScreen && (
                        <li>
                            <div
                                rel="workorders"
                                onClick={mainMenuClickHandler}
                            >
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
                            <div rel="equipment" onClick={mainMenuClickHandler}>
                                <Tooltip title="EQUIPMENT" placement="right">
                                    <Cog style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                    )}

                    {partScreen && (
                        <li>
                            <div rel="materials" onClick={mainMenuClickHandler}>
                                <Tooltip title="MATERIALS" placement="right">
                                    <PartIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                    )}

                    {reports && (
                        <li>
                            <div
                                rel="customgrids"
                                onClick={mainMenuClickHandler}
                            >
                                <Tooltip
                                    title="LISTS & REPORTS"
                                    placement="right"
                                >
                                    <FormatListBulletedTriangle
                                        style={iconStyles}
                                    />
                                </Tooltip>
                            </div>
                        </li>
                    )}

                    <li>
                        <div rel="settings" onClick={mainMenuClickHandler}>
                            <Tooltip title="SETTINGS" placement="right">
                                <Tune style={iconStyles} />
                            </Tooltip>
                        </div>
                    </li>
                </ul>

                <MenuMyWorkorders />

                <MenuMyTeamWorkorders eamAccount={eamAccount} />

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
                                label={
                                    "Search " +
                                    currentWorkOrderScreen.screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="wosearch"
                            />
                        )}
                    </EamlightSubmenu>
                )}

                {(assetScreen ||
                    positionScreen ||
                    systemScreen ||
                    ncrScreen) && (
                    <EamlightSubmenu
                        id="equipment"
                        header={<span>EQUIPMENT</span>}
                    >
                        {assetScreen && (
                            <MenuItem
                                label="Assets"
                                icon={<AssetIcon style={menuIconStyle} />}
                                onClick={() => openSubMenu("assets")}
                            />
                        )}

                        {eamAccount.userGroup === "R5CERN" &&
                            ncrScreen && ( // Limit temporairly to R5CERN
                                <MenuItem
                                    label="NCRs"
                                    icon={<Rule style={menuIconStyle} />} // TODO: Add NCR icon
                                    onClick={() => openSubMenu("ncrs")}
                                />
                            )}

                        {positionScreen && (
                            <MenuItem
                                label="Positions"
                                icon={<PositionIcon style={menuIconStyle} />}
                                onClick={() => openSubMenu("positions")}
                            />
                        )}

                        {systemScreen && (
                            <MenuItem
                                label="Systems"
                                icon={<SystemIcon style={menuIconStyle} />}
                                onClick={() => openSubMenu("systems")}
                            />
                        )}

                        {locationScreen && (
                            <MenuItem
                                label="Locations"
                                icon={<RoomIcon style={menuIconStyle} />}
                                onClick={() => openSubMenu("locations")}
                            />
                        )}

                        <CERNMode>
                            {assetScreen &&
                                screens[assetScreen].updateAllowed && (
                                    <MenuItem
                                        label="Replace Equipment"
                                        icon={
                                            <AutorenewIcon
                                                style={menuIconStyle}
                                            />
                                        }
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
                        {creationAllowed(screens, assetScreen) && (
                            <MenuItem
                                label="New Asset"
                                icon={<AddIcon style={menuIconStyle} />}
                                link="asset"
                            />
                        )}

                        {readAllowed(screens, assetScreen) && (
                            <MenuItem
                                label={
                                    "Search " + screens[assetScreen].screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="assetsearch"
                            />
                        )}

                        <MenuItem
                            label="Back to Equipment"
                            icon={<ArrowBackIcon style={menuIconStyle} />}
                            onClick={() => openSubMenu("equipment")}
                        />
                    </EamlightSubmenu>
                )}

                {ncrScreen && (
                    <EamlightSubmenu id="ncrs">
                        {creationAllowed(screens, ncrScreen) && (
                            <MenuItem
                                label="New NCR"
                                icon={<AddIcon style={menuIconStyle} />}
                                link="ncr"
                            />
                        )}

                        {readAllowed(screens, ncrScreen) && (
                            <MenuItem
                                label={
                                    "Search " + screens[ncrScreen].screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="ncrsearch"
                            />
                        )}

                        <MenuItem
                            label="Back to Equipment"
                            icon={<ArrowBackIcon style={menuIconStyle} />}
                            onClick={() => openSubMenu("equipment")}
                        />
                    </EamlightSubmenu>
                )}

                {positionScreen && (
                    <EamlightSubmenu
                        id="positions"
                        header={getScreenHeader(screenProps.position)}
                    >
                        {creationAllowed(screens, positionScreen) && (
                            <MenuItem
                                label="New Position"
                                icon={<AddIcon style={menuIconStyle} />}
                                link="position"
                            />
                        )}

                        {readAllowed(screens, positionScreen) && (
                            <MenuItem
                                label={
                                    "Search " +
                                    screens[positionScreen].screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="positionsearch"
                            />
                        )}

                        <MenuItem
                            label="Back to Equipment"
                            icon={<ArrowBackIcon style={menuIconStyle} />}
                            onClick={() => openSubMenu("equipment")}
                        />
                    </EamlightSubmenu>
                )}

                {systemScreen && (
                    <EamlightSubmenu
                        id="systems"
                        header={getScreenHeader(screenProps.system)}
                    >
                        {creationAllowed(screens, systemScreen) && (
                            <MenuItem
                                label="New System"
                                icon={<AddIcon style={menuIconStyle} />}
                                link="system"
                            />
                        )}

                        {readAllowed(screens, systemScreen) && (
                            <MenuItem
                                label={
                                    "Search " + screens[systemScreen].screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="systemsearch"
                            />
                        )}

                        <MenuItem
                            label="Back to Equipment"
                            icon={<ArrowBackIcon style={menuIconStyle} />}
                            onClick={() => openSubMenu("equipment")}
                        />
                    </EamlightSubmenu>
                )}

                {locationScreen && (
                    <EamlightSubmenu
                        id="locations"
                        header={getScreenHeader(screenProps.location)}
                    >
                        {readAllowed(screens, locationScreen) && (
                            <MenuItem
                                label={
                                    "Search " +
                                    screens[locationScreen].screenDesc
                                }
                                icon={<SearchIcon style={menuIconStyle} />}
                                link="locationsearch"
                            />
                        )}

                        <MenuItem
                            label="Back to Equipment"
                            icon={<ArrowBackIcon style={menuIconStyle} />}
                            onClick={() => openSubMenu("equipment")}
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
                        <div>
                            {generateReportMenuLinks(reports[EAM_REPORTS_MENU])}
                        </div>

                        {/* Render sub-menus */}
                        {Object.entries(reports).map(
                            ([menuName, menusMetaData]) => {
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
                                            {generateReportMenuLinks(
                                                menusMetaData
                                            )}
                                        </EISPanel>
                                    );
                                }
                            }
                        )}
                    </EamlightSubmenu>
                )}

                <EamlightSubmenu id="settings" header={<span>SETTINGS</span>}>
                    {applicationData.EL_ADMUG &&
                        applicationData.EL_ADMUG.split(",").includes(
                            eamAccount.userGroup
                        ) && (
                            <MenuItem
                                label="Refresh EAM Light Cache"
                                icon={<DatabaseRefresh style={menuIconStyle} />}
                                onClick={() =>
                                    MenuTools.refreshCache(
                                        showNotification,
                                        showError
                                    )
                                }
                            />
                        )}
                    <MenuItemInputHistory />
                </EamlightSubmenu>
            </div>
        </div>
    );
};

export default EamlightMenu;

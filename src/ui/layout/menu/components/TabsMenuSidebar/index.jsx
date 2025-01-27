import Tooltip from "@mui/material/Tooltip";
import { Account, AccountMultiple, Tune, Cog } from "mdi-material-ui";
import {
    PartIcon,
    WorkorderIcon,
} from "eam-components/dist/ui/components/icons";
import FormatListBulletedTriangle from "mdi-material-ui/FormatListBulletedTriangle";
import useUserDataStore from "@/state/useUserDataStore";
import useMyOpenWorkOrdersStore from "@/state/useMyOpenWorkOrdersStore";
import Badge from "./components/Badge";
import useMyTeamWorkOrdersStore from "@/state/useMyTeamWorkOrdersStore";
import useMenuVisibilityStore from "../../../../../state/useMenuVisibilityStore";
import { useEffect } from "react";

const iconStyles = {
    width: 22,
    height: 22,
    color: "white",
};

const TabsMenuSidebar = () => {
    const { myOpenWorkOrders } = useMyOpenWorkOrdersStore();
    const { myTeamWorkOrders, fetchMyTeamWorkOrders } = useMyTeamWorkOrdersStore();

    const {
        userData: {
            workOrderScreen,
            assetScreen,
            ncrScreen,
            positionScreen,
            systemScreen,
            partScreen,
            locationScreen,
            reports,
        },
    } = useUserDataStore();

    const {
        menuVisibility: {
            mywos,
            myteamwos,
            workorders,
            equipment,
            equipmentAssets,
            equipmentNcrs,
            equipmentPositions,
            equipmentSystems,
            equipmentLocations,
            materials,
            customgrids,
            settings,
        },
        setActiveMenuVisibility,
    } = useMenuVisibilityStore();

    useEffect(() => {
        fetchMyTeamWorkOrders();
    }, []);

    return (
        <ul id="layout-tab-menu">
            <li>
                <div
                    className={mywos ? "active" : ""}
                    onClick={() => {
                        setActiveMenuVisibility("mywos");
                        window.dispatchEvent(new CustomEvent("resize"));
                    }}
                >
                    <Tooltip title="MY OPEN WOs" placement="right">
                        <Account style={iconStyles} />
                    </Tooltip>
                    <Badge count={myOpenWorkOrders.length} />
                </div>
            </li>

            <li>
                <div
                    className={myteamwos ? "active" : ""}
                    onClick={() => {
                        setActiveMenuVisibility("myteamwos");
                        window.dispatchEvent(new CustomEvent("resize"));
                    }}
                >
                    <Tooltip title="MY TEAM's WOs" placement="right">
                        <AccountMultiple style={iconStyles} />
                    </Tooltip>
                    <Badge count={myTeamWorkOrders.length} />
                </div>
            </li>

            {workOrderScreen && (
                <li>
                    <div
                        className={workorders ? "active" : ""}
                        onClick={() => setActiveMenuVisibility("workorders")}
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
                    <div
                        className={
                            equipment ||
                            equipmentAssets ||
                            equipmentNcrs ||
                            equipmentPositions ||
                            equipmentSystems ||
                            equipmentLocations
                                ? "active"
                                : ""
                        }
                        onClick={() => setActiveMenuVisibility("equipment")}
                    >
                        <Tooltip title="EQUIPMENT" placement="right">
                            <Cog style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            {partScreen && (
                <li>
                    <div
                        className={materials ? "active" : ""}
                        onClick={() => setActiveMenuVisibility("materials")}
                    >
                        <Tooltip title="MATERIALS" placement="right">
                            <PartIcon style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            {reports && (
                <li>
                    <div
                        className={customgrids ? "active" : ""}
                        onClick={() => setActiveMenuVisibility("customgrids")}
                    >
                        <Tooltip title="LISTS & REPORTS" placement="right">
                            <FormatListBulletedTriangle style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            <li>
                <div
                    className={settings ? "active" : ""}
                    onClick={() => setActiveMenuVisibility("settings")}
                >
                    <Tooltip title="SETTINGS" placement="right">
                        <Tune style={iconStyles} />
                    </Tooltip>
                </div>
            </li>
        </ul>
    );
};

export default TabsMenuSidebar;

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

const iconStyles = {
    width: 22,
    height: 22,
    color: "white",
};

const TabsMenu = ({ onTabClick }) => {
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
    const { myOpenWorkOrders } = useMyOpenWorkOrdersStore();
    const { myTeamWorkOrders } = useMyTeamWorkOrdersStore();

    return (
        <ul id="layout-tab-menu">
            <li>
                <div rel="mywos" className="active" onClick={onTabClick}>
                    <Tooltip title="MY OPEN WOs" placement="right">
                        <Account style={iconStyles} />
                    </Tooltip>
                    <Badge count={myOpenWorkOrders.length} />
                </div>
            </li>

            <li>
                <div rel="myteamwos" onClick={onTabClick}>
                    <Tooltip title="MY TEAM's WOs" placement="right">
                        <AccountMultiple style={iconStyles} />
                    </Tooltip>
                    <Badge count={myTeamWorkOrders.length} />
                </div>
            </li>

            {workOrderScreen && (
                <li>
                    <div rel="workorders" onClick={onTabClick}>
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
                    <div rel="equipment" onClick={onTabClick}>
                        <Tooltip title="EQUIPMENT" placement="right">
                            <Cog style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            {partScreen && (
                <li>
                    <div rel="materials" onClick={onTabClick}>
                        <Tooltip title="MATERIALS" placement="right">
                            <PartIcon style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            {reports && (
                <li>
                    <div rel="customgrids" onClick={onTabClick}>
                        <Tooltip title="LISTS & REPORTS" placement="right">
                            <FormatListBulletedTriangle style={iconStyles} />
                        </Tooltip>
                    </div>
                </li>
            )}

            <li>
                <div rel="settings" onClick={onTabClick}>
                    <Tooltip title="SETTINGS" placement="right">
                        <Tune style={iconStyles} />
                    </Tooltip>
                </div>
            </li>
        </ul>
    );
};

export default TabsMenu;

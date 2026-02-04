import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import MenuItem from "./common/MenuItem";
import {
    AssetIcon,
    PositionIcon,
    SystemIcon,
} from "eam-components/dist/ui/components/icons";
import RoomIcon from "@mui/icons-material/Room";
import SpeedometerIcon from "mdi-material-ui/Speedometer";
import BuildIcon from "@mui/icons-material/Build";
import AutorenewIcon from "mdi-material-ui/Autorenew";
import CERNMode from "@/ui/components/CERNMode";
import Rule from "@mui/icons-material/Rule";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";

const EquipmentMenu = ({ classes }) => {
    const {
        userData: {
            assetScreen,
            ncrScreen,
            positionScreen,
            systemScreen,
            locationScreen,
            screens,
            eamAccount,
        },
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const assetScreenPermissions = useScreenPermissions(assetScreen);

    return (
        (assetScreen || positionScreen || systemScreen || ncrScreen) && (
            <SubMenu id="equipment" header={<span>EQUIPMENT</span>}>
                {assetScreen && (
                    <MenuItem
                        label={screens[assetScreen]?.screenDesc ?? 'Assets*'}
                        icon={<AssetIcon className={classes.menuIcon} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentAssets")
                        }
                    />
                )}

                {ncrScreen && ( 
                        <MenuItem
                            label={screens[ncrScreen]?.screenDesc ?? 'NCRs*'}
                            icon={<Rule className={classes.menuIcon} />} // TODO: Add NCR icon
                            onClick={() =>
                                setActiveMenuVisibility("equipmentNcrs")
                            }
                        />
                )}

                {positionScreen && (
                    <MenuItem
                        label={screens[positionScreen]?.screenDesc ?? 'Positions*'}
                        icon={<PositionIcon className={classes.menuIcon} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentPositions")
                        }
                    />
                )}

                {systemScreen && (
                    <MenuItem
                        label={screens[systemScreen]?.screenDesc ?? 'Systems*'}
                        icon={<SystemIcon className={classes.menuIcon} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentSystems")
                        }
                    />
                )}

                {locationScreen && (
                    <MenuItem
                        label={screens[locationScreen]?.screenDesc ?? 'Locations*'}
                        icon={<RoomIcon className={classes.menuIcon} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentLocations")
                        }
                    />
                )}

                <CERNMode>
                    {assetScreenPermissions?.updateAllowed && (
                        <MenuItem
                            label="Replace Equipment"
                            icon={
                                <AutorenewIcon className={classes.menuIcon} />
                            }
                            link="replaceeqp"
                        />
                    )}
                </CERNMode>

                <MenuItem
                    label="Meter Reading"
                    icon={<SpeedometerIcon className={classes.menuIcon} />}
                    link="meterreading"
                />

                <MenuItem
                    label="Install / Detach Equipment"
                    icon={<BuildIcon className={classes.menuIcon} />}
                    link="installeqp"
                />
            </SubMenu>
        )
    );
};

const StyledEquipmentMenu = withStyles(styles)(EquipmentMenu);

export default StyledEquipmentMenu;

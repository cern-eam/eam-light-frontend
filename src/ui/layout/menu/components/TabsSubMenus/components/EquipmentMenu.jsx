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

const EquipmentMenu = ({ iconStyle }) => {
    const {
        userData: {
            assetScreen,
            ncrScreen,
            positionScreen,
            systemScreen,
            locationScreen,
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
                        label="Assets"
                        icon={<AssetIcon style={iconStyle} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentAssets")
                        }
                    />
                )}

                {eamAccount.userGroup === "R5CERN" &&
                    ncrScreen && ( // Limit temporairly to R5CERN
                        <MenuItem
                            label="NCRs"
                            icon={<Rule style={iconStyle} />} // TODO: Add NCR icon
                            onClick={() =>
                                setActiveMenuVisibility("equipmentNcrs")
                            }
                        />
                    )}

                {positionScreen && (
                    <MenuItem
                        label="Positions"
                        icon={<PositionIcon style={iconStyle} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentPositions")
                        }
                    />
                )}

                {systemScreen && (
                    <MenuItem
                        label="Systems"
                        icon={<SystemIcon style={iconStyle} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentSystems")
                        }
                    />
                )}

                {locationScreen && (
                    <MenuItem
                        label="Locations"
                        icon={<RoomIcon style={iconStyle} />}
                        onClick={() =>
                            setActiveMenuVisibility("equipmentLocations")
                        }
                    />
                )}

                <CERNMode>
                    {assetScreenPermissions?.updateAllowed && (
                        <MenuItem
                            label="Replace Equipment"
                            icon={<AutorenewIcon style={iconStyle} />}
                            link="replaceeqp"
                        />
                    )}
                </CERNMode>

                <MenuItem
                    label="Meter Reading"
                    icon={<SpeedometerIcon style={iconStyle} />}
                    link="meterreading"
                />

                <MenuItem
                    label="Install / Detach Equipment"
                    icon={<BuildIcon style={iconStyle} />}
                    link="installeqp"
                />
            </SubMenu>
        )
    );
};

export default EquipmentMenu;

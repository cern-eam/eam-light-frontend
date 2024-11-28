import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";

const EquipmentAssetMenu = ({ classes }) => {
    const {
        userData: { assetScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const assetScreenPermissions = useScreenPermissions(assetScreen);

    const assetScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJA"
            ),
        [screens]
    );

    if (!assetScreen) return null;

    return (
        <SubMenu
            id="assets"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ assetScreen: screenCode })
                    }
                    screen={assetScreen}
                    screens={assetScreens}
                />
            }
        >
            {assetScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Asset"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="asset"
                />
            )}

            {assetScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[assetScreen].screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="assetsearch"
                />
            )}

            <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon className={classes.menuIcon} />}
                onClick={() => setActiveMenuVisibility("equipment")}
            />
        </SubMenu>
    );
};

const StyledEquipmentAssetMenu = withStyles(styles)(EquipmentAssetMenu);

export default StyledEquipmentAssetMenu;

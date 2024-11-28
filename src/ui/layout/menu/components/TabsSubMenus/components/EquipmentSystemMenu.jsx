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

const EquipmentSystemMenu = ({ classes }) => {
    const {
        userData: { systemScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const systemScreenPermissions = useScreenPermissions(systemScreen);

    const systemScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJS"
            ),
        [screens]
    );

    if (!systemScreen) return null;

    return (
        <SubMenu
            id="systems"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ systemScreen: screenCode })
                    }
                    screen={systemScreen}
                    screens={systemScreens}
                />
            }
        >
            {systemScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New System"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="system"
                />
            )}

            {systemScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[systemScreen].screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="systemsearch"
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

const StyledEquipmentSystemMenu = withStyles(styles)(EquipmentSystemMenu);

export default StyledEquipmentSystemMenu;

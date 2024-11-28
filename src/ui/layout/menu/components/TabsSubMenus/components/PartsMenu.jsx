import useUserDataStore from "@/state/useUserDataStore";
import StyledScreenChange from "./common/ScreenChange";
import SubMenu from "./common/SubMenu";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import useScreenPermissions from "../hooks/useScreenPermissions";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";

const PartsMenu = ({ classes }) => {
    const {
        userData: { partScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const partScreenPermissions = useScreenPermissions(partScreen);

    const currentPartScreen = useMemo(
        () => screens[partScreen] || {},
        [screens, partScreen]
    );

    const partScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "SSPART"
            ),
        [screens]
    );

    if (!partScreen) return null;

    return (
        <SubMenu
            id="materials"
            header={
                <StyledScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ partScreen: screenCode })
                    }
                    screen={partScreen}
                    screens={partScreens}
                />
            }
        >
            {partScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Part"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="part"
                />
            )}

            {partScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + currentPartScreen.screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="partsearch"
                />
            )}
        </SubMenu>
    );
};

const StyledPartsMenu = withStyles(styles)(PartsMenu);

export default StyledPartsMenu;

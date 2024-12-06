import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import MenuItem from "./common/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";
import useScreenPermissions from "../hooks/useScreenPermissions";

const EquipmentLocationMenu = ({ classes }) => {
    const {
        userData: { locationScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const locationScreenPermissions = useScreenPermissions(locationScreen);

    if (!locationScreen) return null;

    return (
        <SubMenu
            id="locations"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ locationScreen: screenCode })
                    }
                    screenCode={locationScreen}
                    screenId="OSOBJL"
                />
            }
        >
            {locationScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[locationScreen].screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="locationsearch"
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

const StyledEquipmentLocationMenu = withStyles(styles)(EquipmentLocationMenu);

export default StyledEquipmentLocationMenu;

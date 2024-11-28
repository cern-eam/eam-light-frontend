import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";

const EquipmentPositionMenu = ({ classes }) => {
    const {
        userData: { positionScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const positionScreenPermissions = useScreenPermissions(positionScreen);

    if (!positionScreen) return null;

    return (
        <SubMenu
            id="positions"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ positionScreen: screenCode })
                    }
                    screenCode={positionScreen}
                    screenId="OSOBJP"
                />
            }
        >
            {positionScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Position"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="position"
                />
            )}

            {positionScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[positionScreen].screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="positionsearch"
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

const StyledEquipmentPositionMenu = withStyles(styles)(EquipmentPositionMenu);

export default StyledEquipmentPositionMenu;

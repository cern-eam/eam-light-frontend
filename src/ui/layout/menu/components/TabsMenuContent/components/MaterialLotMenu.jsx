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

const MaterialLotMenu = ({ classes }) => {
    const {
        userData: { lotScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const lotScreenPermissions = useScreenPermissions(lotScreen);

    if (!lotScreen) return null;

    return (
        <SubMenu
            id="lots"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ lotScreen: screenCode })
                    }
                    screenCode={lotScreen}
                    screenId="SSLOTS"
                />
            }
        >
            {lotScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Lot"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="lot"
                />
            )}

            {lotScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[lotScreen]?.screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="lotsearch"
                />
            )}

            <MenuItem
                label="Back to Materials"
                icon={<ArrowBackIcon className={classes.menuIcon} />}
                onClick={() => setActiveMenuVisibility("materials")}
            />
        </SubMenu>
    );
};

const StyledMaterialLotMenu = withStyles(styles)(MaterialLotMenu);

export default StyledMaterialLotMenu;

import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../styles";

const EquipmentNcrMenu = ({ classes }) => {
    const {
        userData: { ncrScreen, screens },
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const ncrScreenPermissions = useScreenPermissions(ncrScreen);

    if (!ncrScreen) return null;

    return (
        <SubMenu id="ncrs">
            {ncrScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New NCR"
                    icon={<AddIcon className={classes.menuIcon} />}
                    link="ncr"
                />
            )}

            {ncrScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[ncrScreen].screenDesc}
                    icon={<SearchIcon className={classes.menuIcon} />}
                    link="ncrsearch"
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

const StyledEquipmentNcrMenu = withStyles(styles)(EquipmentNcrMenu);

export default StyledEquipmentNcrMenu;

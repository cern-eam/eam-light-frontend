import SubMenu from "../common/SubMenu";
import useApplicationDataStore from "@/state/useApplicationDataStore";
import useUserDataStore from "@/state/useUserDataStore";
import useSnackbarStore from "@/state/useSnackbarStore";
import MenuItem from "../common/MenuItem";
import { DatabaseRefresh } from "mdi-material-ui";
import MenuTools from "../../../../MenuTools";
import MenuItemInputHistory from "./components/MenuItemInputHistory";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../../styles";

const SettingsMenu = ({ classes }) => {
    const { applicationData } = useApplicationDataStore();
    const {
        userData: { eamAccount },
    } = useUserDataStore();
    const { showError, showNotification } = useSnackbarStore();

    return (
        <SubMenu id="settings" header={<span>SETTINGS</span>}>
            {(applicationData.EL_ADMUG && applicationData.EL_ADMUG.split(",").includes(eamAccount.userGroup) 
             || eamAccount.userDefinedFields.udfchkbox02 === 'true'
                ) && (
                    <MenuItem
                        label="Refresh EAM Light Cache"
                        icon={<DatabaseRefresh className={classes.menuIcon} />}
                        onClick={() =>
                            MenuTools.refreshCache(showNotification, showError)
                        }
                    />
                )}
            <MenuItemInputHistory />
        </SubMenu>
    );
};

const StyledSettingsMenu = withStyles(styles)(SettingsMenu);

export default StyledSettingsMenu;

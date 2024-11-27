import SubMenu from "../common/SubMenu";
import useApplicationDataStore from "@/state/useApplicationDataStore";
import useUserDataStore from "@/state/useUserDataStore";
import MenuItem from "../common/MenuItem";
import { DatabaseRefresh } from "mdi-material-ui";
import MenuTools from "../../../../MenuTools";
import MenuItemInputHistory from "./components/MenuItemInputHistory";

const SettingsMenu = ({
    iconStyle,
    disabledIconStyle,
    showNotification,
    showError,
}) => {
    const { applicationData } = useApplicationDataStore();
    const {
        userData: { eamAccount },
    } = useUserDataStore();

    return (
        <SubMenu id="settings" header={<span>SETTINGS</span>}>
            {applicationData.EL_ADMUG &&
                applicationData.EL_ADMUG.split(",").includes(
                    eamAccount.userGroup
                ) && (
                    <MenuItem
                        label="Refresh EAM Light Cache"
                        icon={<DatabaseRefresh style={iconStyle} />}
                        onClick={() =>
                            MenuTools.refreshCache(showNotification, showError)
                        }
                    />
                )}
            <MenuItemInputHistory
                iconStyle={iconStyle}
                disabledIconStyle={disabledIconStyle}
            />
        </SubMenu>
    );
};

export default SettingsMenu;

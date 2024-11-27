import MyWorkordersMenu from "./components/MyWorkordersMenu";
import MyTeamWorkordersMenu from "./components/MyTeamWorkordersMenu";
import WorkordersMenu from "./components/WorkordersMenu";
import PartsMenu from "./components/PartsMenu";
import ReportsMenu from "./components/ReportsMenu";
import SettingsMenu from "./components/SettingsMenu";
import EquipmentMenu from "./components/EquipmentMenu";

export const menuIconStyle = {
    display: "inline-block",
    marginRight: 5,
    color: "#f7ce03",
    width: "100%",
    height: 36,
};

export const menuIconStyleDisabled = {
    ...menuIconStyle,
    color: "#8b8c8b",
};

const TabsSubMenus = ({ onTabsSubMenuClick, showNotification, showError }) => {
    return (
        <>
            <MyWorkordersMenu />

            <MyTeamWorkordersMenu />

            <WorkordersMenu iconStyle={menuIconStyle} />

            <EquipmentMenu
                iconStyle={menuIconStyle}
                onTabsSubMenuClick={onTabsSubMenuClick}
            />

            <PartsMenu iconStyle={menuIconStyle} />

            <ReportsMenu />

            <SettingsMenu
                iconStyle={menuIconStyle}
                disabledIconStyle={menuIconStyleDisabled}
                showNotification={showNotification}
                showError={showError}
            />
        </>
    );
};

export default TabsSubMenus;

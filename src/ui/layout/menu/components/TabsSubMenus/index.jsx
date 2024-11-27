import MyWorkordersMenu from "./components/MyWorkordersMenu";
import MyTeamWorkordersMenu from "./components/MyTeamWorkordersMenu";
import WorkordersMenu from "./components/WorkordersMenu";
import PartsMenu from "./components/PartsMenu";
import ReportsMenu from "./components/ReportsMenu";
import SettingsMenu from "./components/SettingsMenu";
import EquipmentMenu from "./components/EquipmentMenu";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import EquipmentAssetMenu from "./components/EquipmentAssetMenu";
import EquipmentNcrMenu from "./components/EquipmentNcrMenu";
import EquipmentPositionMenu from "./components/EquipmentPositionMenu";
import EquipmentSystemMenu from "./components/EquipmentSystemMenu";
import EquipmentLocationMenu from "./components/EquipmentLocationMenu";

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

const TabsSubMenus = () => {
    const {
        menuVisibility: {
            mywos,
            myteamwos,
            workorders,
            equipment,
            materials,
            customgrids,
            settings,
            equipmentAssets,
            equipmentNcrs,
            equipmentPositions,
            equipmentSystems,
            equipmentLocations,
        },
    } = useMenuVisibilityStore();

    return (
        <>
            {mywos && <MyWorkordersMenu />}
            {myteamwos && <MyTeamWorkordersMenu />}
            {workorders && <WorkordersMenu iconStyle={menuIconStyle} />}
            {equipment && <EquipmentMenu iconStyle={menuIconStyle} />}
            {materials && <PartsMenu iconStyle={menuIconStyle} />}
            {customgrids && <ReportsMenu />}
            {settings && (
                <SettingsMenu
                    iconStyle={menuIconStyle}
                    disabledIconStyle={menuIconStyleDisabled}
                />
            )}
            {equipmentAssets && (
                <EquipmentAssetMenu iconStyle={menuIconStyle} />
            )}

            {equipmentNcrs && <EquipmentNcrMenu iconStyle={menuIconStyle} />}
            {equipmentPositions && (
                <EquipmentPositionMenu iconStyle={menuIconStyle} />
            )}
            {equipmentSystems && (
                <EquipmentSystemMenu iconStyle={menuIconStyle} />
            )}
            {equipmentLocations && (
                <EquipmentLocationMenu iconStyle={menuIconStyle} />
            )}
        </>
    );
};

export default TabsSubMenus;

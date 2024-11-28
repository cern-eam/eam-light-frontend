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
            {workorders && <WorkordersMenu />}
            {equipment && <EquipmentMenu />}
            {materials && <PartsMenu />}
            {customgrids && <ReportsMenu />}
            {settings && <SettingsMenu />}
            {equipmentAssets && <EquipmentAssetMenu />}
            {equipmentNcrs && <EquipmentNcrMenu />}
            {equipmentPositions && <EquipmentPositionMenu />}
            {equipmentSystems && <EquipmentSystemMenu />}
            {equipmentLocations && <EquipmentLocationMenu />}
        </>
    );
};

export default TabsSubMenus;

import { useCallback } from "react";
import EquipmentMainMenu from "./components/EquipmentMainMenu";
import EquipmentSubMenus from "./components/EquipmentSubMenus";

const EquipmentMenu = ({ iconStyle, onTabsSubMenuClick }) => {
    const onBackToEquipmentClick = useCallback(
        () => onTabsSubMenuClick("equipment"),
        []
    );

    return (
        <>
            <EquipmentMainMenu
                iconStyle={iconStyle}
                onTabsSubMenuClick={onTabsSubMenuClick}
            />

            <EquipmentSubMenus
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />
        </>
    );
};

export default EquipmentMenu;

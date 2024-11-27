import PositionMenu from "./components/PositionMenu";
import NcrMenu from "./components/NcrMenu";
import AssetMenu from "./components/AssetMenu";
import SystemMenu from "./components/SystemMenu";
import LocationMenu from "./components/LocationMenu";

const EquipmentSubMenus = ({ iconStyle, onBackToEquipmentClick }) => {
    return (
        <>
            <AssetMenu
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />

            <NcrMenu
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />

            <PositionMenu
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />

            <SystemMenu
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />

            <LocationMenu
                iconStyle={iconStyle}
                onBackToEquipmentClick={onBackToEquipmentClick}
            />
        </>
    );
};

export default EquipmentSubMenus;

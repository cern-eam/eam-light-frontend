import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";

const EquipmentAssetMenu = ({ iconStyle }) => {
    const {
        userData: { assetScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();

    const assetScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJA"
            ),
        [screens]
    );

    const creationAllowed = useMemo(
        () =>
            assetScreen &&
            screens[assetScreen] &&
            screens[assetScreen].creationAllowed,
        [screens, assetScreen]
    );

    const readAllowed = useMemo(
        () =>
            screen && screens[assetScreen] && screens[assetScreen].readAllowed,
        [screens, assetScreen]
    );

    if (!assetScreen) return null;

    return (
        <SubMenu
            id="assets"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ assetScreen: screenCode })
                    }
                    screen={assetScreen}
                    screens={assetScreens}
                />
            }
        >
            {creationAllowed && (
                <MenuItem
                    label="New Asset"
                    icon={<AddIcon style={iconStyle} />}
                    link="asset"
                />
            )}

            {readAllowed && (
                <MenuItem
                    label={"Search " + screens[assetScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="assetsearch"
                />
            )}

            <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={iconStyle} />}
                onClick={() => setActiveMenuVisibility("equipment")}
            />
        </SubMenu>
    );
};

export default EquipmentAssetMenu;

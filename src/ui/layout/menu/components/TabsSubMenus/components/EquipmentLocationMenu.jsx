import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";

const EquipmentLocationMenu = ({ iconStyle }) => {
    const {
        userData: { locationScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();

    const locationScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJL"
            ),
        [screens]
    );

    const readAllowed = useMemo(
        () =>
            screen &&
            screens[locationScreen] &&
            screens[locationScreen].readAllowed,
        [screens, locationScreen]
    );

    if (!locationScreen) return null;

    return (
        <SubMenu
            id="locations"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ locationScreen: screenCode })
                    }
                    screen={locationScreen}
                    screens={locationScreens}
                />
            }
        >
            {readAllowed && (
                <MenuItem
                    label={"Search " + screens[locationScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="locationsearch"
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

export default EquipmentLocationMenu;

import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";

const EquipmentPositionMenu = ({ iconStyle }) => {
    const {
        userData: { positionScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();

    const positionScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJP"
            ),
        [screens]
    );

    const creationAllowed = useMemo(
        () =>
            positionScreen &&
            screens[positionScreen] &&
            screens[positionScreen].creationAllowed,
        [screens, positionScreen]
    );

    const readAllowed = useMemo(
        () =>
            screen &&
            screens[positionScreen] &&
            screens[positionScreen].readAllowed,
        [screens, positionScreen]
    );

    if (!positionScreen) return null;

    return (
        <SubMenu
            id="positions"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ positionScreen: screenCode })
                    }
                    screen={positionScreen}
                    screens={positionScreens}
                />
            }
        >
            {creationAllowed && (
                <MenuItem
                    label="New Position"
                    icon={<AddIcon style={iconStyle} />}
                    link="position"
                />
            )}

            {readAllowed && (
                <MenuItem
                    label={"Search " + screens[positionScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="positionsearch"
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

export default EquipmentPositionMenu;

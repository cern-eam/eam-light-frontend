import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "../../../../common/SubMenu";
import ScreenChange from "../../../../common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "../../../../common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SystemMenu = ({ iconStyle, onBackToEquipmentClick }) => {
    const {
        userData: { systemScreen, screens },
        setUserData,
    } = useUserDataStore();

    const systemScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJS"
            ),
        [screens]
    );

    const creationAllowed = useMemo(
        () =>
            systemScreen &&
            screens[systemScreen] &&
            screens[systemScreen].creationAllowed,
        [screens, systemScreen]
    );

    const readAllowed = useMemo(
        () =>
            screen &&
            screens[systemScreen] &&
            screens[systemScreen].readAllowed,
        [screens, systemScreen]
    );

    if (!systemScreen) return null;

    return (
        <SubMenu
            id="systems"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        setUserData({ systemScreen: screenCode })
                    }
                    screen={systemScreen}
                    screens={systemScreens}
                />
            }
        >
            {creationAllowed && (
                <MenuItem
                    label="New System"
                    icon={<AddIcon style={iconStyle} />}
                    link="system"
                />
            )}

            {readAllowed && (
                <MenuItem
                    label={"Search " + screens[systemScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="systemsearch"
                />
            )}

            <MenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={iconStyle} />}
                onClick={onBackToEquipmentClick}
            />
        </SubMenu>
    );
};

export default SystemMenu;

import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import ScreenChange from "./common/ScreenChange";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";

const EquipmentPositionMenu = ({ iconStyle }) => {
    const {
        userData: { positionScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const positionScreenPermissions = useScreenPermissions(positionScreen);

    const positionScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "OSOBJP"
            ),
        [screens]
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
            {positionScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Position"
                    icon={<AddIcon style={iconStyle} />}
                    link="position"
                />
            )}

            {positionScreenPermissions?.readAllowed && (
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

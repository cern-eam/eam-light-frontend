import useUserDataStore from "@/state/useUserDataStore";
import StyledScreenChange from "./common/ScreenChange";
import SubMenu from "./common/SubMenu";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const PartsMenu = ({ iconStyle }) => {
    const {
        userData: { partScreen, screens },
        setUserData,
    } = useUserDataStore();

    const currentPartScreen = useMemo(
        () => screens[partScreen] || {},
        [screens, partScreen]
    );

    const partScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "SSPART"
            ),
        [screens]
    );

    if (!partScreen) return null;

    return (
        <SubMenu
            id="materials"
            header={
                <StyledScreenChange
                    updateScreenLayout={(screenCode) =>
                        setUserData({ partScreen: screenCode })
                    }
                    screen={partScreen}
                    screens={partScreens}
                />
            }
        >
            {currentPartScreen.creationAllowed && (
                <MenuItem
                    label="New Part"
                    icon={<AddIcon style={iconStyle} />}
                    link="part"
                />
            )}

            {currentPartScreen.readAllowed && (
                <MenuItem
                    label={"Search " + currentPartScreen.screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="partsearch"
                />
            )}
        </SubMenu>
    );
};

export default PartsMenu;

import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import SubMenu from "./common/SubMenu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import useUserDataStore from "@/state/useUserDataStore";
import ScreenChange from "./common/ScreenChange";
import useScreenPermissions from "../hooks/useScreenPermissions";

const WorkordersMenu = ({ iconStyle }) => {
    const {
        userData: { workOrderScreen, screens },
        updateUserData,
    } = useUserDataStore();
    const workOrderScreenPermissions = useScreenPermissions(workOrderScreen);

    const currentWorkOrderScreen = useMemo(
        () => screens[workOrderScreen] || {},
        [screens, workOrderScreen]
    );

    const workOrderScreens = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === "WSJOBS"
            ),
        [screens]
    );

    if (!workOrderScreens) return null;

    return (
        <SubMenu
            id="workorders"
            header={
                <ScreenChange
                    updateScreenLayout={(screenCode) =>
                        updateUserData({ workOrderScreen: screenCode })
                    }
                    screen={workOrderScreen}
                    screens={workOrderScreens}
                />
            }
        >
            {workOrderScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New Work Order"
                    icon={<AddIcon style={iconStyle} />}
                    link="workorder"
                />
            )}

            {workOrderScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + currentWorkOrderScreen.screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="wosearch"
                />
            )}
        </SubMenu>
    );
};

export default WorkordersMenu;

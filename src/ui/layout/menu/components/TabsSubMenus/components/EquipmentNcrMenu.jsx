import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "./common/SubMenu";
import { useMemo } from "react";
import MenuItem from "./common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMenuVisibilityStore from "@/state/useMenuVisibilityStore";
import useScreenPermissions from "../hooks/useScreenPermissions";

const EquipmentNcrMenu = ({ iconStyle }) => {
    const {
        userData: { ncrScreen, screens },
    } = useUserDataStore();
    const { setActiveMenuVisibility } = useMenuVisibilityStore();
    const ncrScreenPermissions = useScreenPermissions(ncrScreen);

    if (!ncrScreen) return null;

    return (
        <SubMenu id="ncrs">
            {ncrScreenPermissions?.creationAllowed && (
                <MenuItem
                    label="New NCR"
                    icon={<AddIcon style={iconStyle} />}
                    link="ncr"
                />
            )}

            {ncrScreenPermissions?.readAllowed && (
                <MenuItem
                    label={"Search " + screens[ncrScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="ncrsearch"
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

export default EquipmentNcrMenu;

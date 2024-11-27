import useUserDataStore from "@/state/useUserDataStore";
import SubMenu from "../../../../common/SubMenu";
import { useMemo } from "react";
import MenuItem from "../../../../common/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NcrMenu = ({ iconStyle, onBackToEquipmentClick }) => {
    const {
        userData: { ncrScreen, screens },
    } = useUserDataStore();

    const creationAllowed = useMemo(
        () =>
            ncrScreen &&
            screens[ncrScreen] &&
            screens[ncrScreen].creationAllowed,
        [screens, ncrScreen]
    );

    const readAllowed = useMemo(
        () => screen && screens[ncrScreen] && screens[ncrScreen].readAllowed,
        [screens, ncrScreen]
    );

    if (!ncrScreen) return null;

    return (
        <SubMenu id="ncrs">
            {creationAllowed && (
                <MenuItem
                    label="New NCR"
                    icon={<AddIcon style={iconStyle} />}
                    link="ncr"
                />
            )}

            {readAllowed && (
                <MenuItem
                    label={"Search " + screens[ncrScreen].screenDesc}
                    icon={<SearchIcon style={iconStyle} />}
                    link="ncrsearch"
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

export default NcrMenu;

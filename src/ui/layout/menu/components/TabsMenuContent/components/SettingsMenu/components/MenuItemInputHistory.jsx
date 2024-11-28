import HistoryIcon from "@mui/icons-material/History";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import MenuItem from "../../common/MenuItem";
import useLocalStorage from "@/hooks/useLocalStorage";
import { INPUT_HISTORY_SETTING_KEY } from "eam-components/dist/ui/components/inputs-ng/tools/history-tools";
import withStyles from "@mui/styles/withStyles";
import { styles } from "../../../styles";

const MenuItemInputHistory = ({ classes }) => {
    const [historySetting, setHistorySetting] = useLocalStorage(
        INPUT_HISTORY_SETTING_KEY,
        false
    );

    const menuProps = historySetting
        ? {
              label: "Disable Input History",
              icon: <HistoryIcon className={classes.menuIcon} />,
              onClick: () => setHistorySetting(false),
          }
        : {
              label: "Enable Input History",
              icon: (
                  <HistoryToggleOffIcon className={classes.menuIconDisabled} />
              ),
              onClick: () => setHistorySetting(true),
          };

    return <MenuItem {...menuProps} />;
};

const StyledMenuItemInputHistory = withStyles(styles)(MenuItemInputHistory);

export default StyledMenuItemInputHistory;

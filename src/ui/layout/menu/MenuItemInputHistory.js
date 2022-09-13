import HistoryIcon from '@mui/icons-material/History';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import MenuItem from './MenuItem';
import { menuIconStyle, menuIconStyleDisabled } from './EamlightMenu';
import useLocalStorage from 'hooks/useLocalStorage';
import { INPUT_HISTORY_SETTING_KEY } from 'eam-components/dist/ui/components/inputs-ng/tools/history-tools';

const MenuItemInputHistory = () => {
    const [historySetting, setHistorySetting] = useLocalStorage(
        INPUT_HISTORY_SETTING_KEY,
        false
    );

    const menuProps = historySetting
        ? {
              label: 'Disable Input History',
              icon: <HistoryIcon style={menuIconStyle} />,
              onClick: () => setHistorySetting(false),
          }
        : {
              label: 'Enable Input History',
              icon: <HistoryToggleOffIcon style={menuIconStyleDisabled} />,
              onClick: () => setHistorySetting(true),
          };

    return <MenuItem {...menuProps} />;
};

export default MenuItemInputHistory;

import { React } from "mdi-material-ui";
import Divider from '@mui/material/Divider';
import LaunchIcon from '@mui/icons-material/Launch';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const { Menu, MenuItem } = require("@mui/material")

const NodeSelectMenu = props => {

    const {anchorEl, handleClose, currentRow, _navigate, eqpTreeMenu} = props;

    const openHandler = () => {
        handleClose();
        _navigate(currentRow);
    }

    if (!currentRow || !eqpTreeMenu) {
        return React.Fragment;
    }

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
        {eqpTreeMenu.map( (menu, index) => 
            <MenuItem key={index}
            onClick={() => {
                handleClose();
                menu.handler(currentRow);
            }}>
                {menu.icon && (<ListItemIcon>{menu.icon}</ListItemIcon>)}
                <ListItemText>{menu.desc}</ListItemText>
                </MenuItem>
        )}
        <Divider/>
        <MenuItem onClick={openHandler}>
        <ListItemIcon><LaunchIcon/></ListItemIcon> 
        <ListItemText>{currentRow.node.id}</ListItemText>
        </MenuItem>
      </Menu>
    )

}

export default NodeSelectMenu;
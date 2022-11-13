import { React } from "mdi-material-ui";
import Divider from '@mui/material/Divider';

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
        {eqpTreeMenu.map(menu => 
            <MenuItem onClick={() => {
                handleClose();
                menu.handler(currentRow);
            }}>{menu.desc}</MenuItem>
        )}
        <Divider/>
        <MenuItem onClick={openHandler}>Open {currentRow.node.id}</MenuItem>
      </Menu>
    )

}

export default NodeSelectMenu;
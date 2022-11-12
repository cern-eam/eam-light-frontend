import { React } from "mdi-material-ui";

const { Menu, MenuItem } = require("@mui/material")

const NodeSelectMenu = props => {

    const {anchorEl, handleClose, currentRow, _navigate, eqpTreeMenu} = props;

    const openHandler = () => {
        handleClose();
        _navigate(currentRow);
    }

    const otherHandler = () => {
        handleClose();
        eqpTreeMenu.handler(currentRow);
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
        <MenuItem onClick={openHandler}>Open {currentRow.node.id}</MenuItem>
        <MenuItem onClick={otherHandler}>{eqpTreeMenu.desc}</MenuItem>
      </Menu>
    )

}

export default NodeSelectMenu;
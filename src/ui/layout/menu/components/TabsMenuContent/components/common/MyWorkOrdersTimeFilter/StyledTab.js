import withStyles from '@mui/styles/withStyles';
import Tab from "@mui/material/Tab";

const StyledTab = withStyles({
    root: {
        width: 50,
        minWidth: 50,
        color: "white"
    }
})(Tab)

export default StyledTab;
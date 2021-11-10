import {withStyles} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";

// At the time of writing, this is required for the tab indicator on my team WOs to display nicely
// Identified in issue https://github.com/mui-org/material-ui/issues/9337
// Fixed in material-ui on Aug 26th https://github.com/mui-org/material-ui/pull/27791
const StyledTabs = withStyles({
    indicator: {
        transition: 'none'
    }
})(Tabs)

export default StyledTabs;
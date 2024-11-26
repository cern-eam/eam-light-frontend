import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import withStyles from "@mui/styles/withStyles";

const styles = {
    root: {
        marginLeft: 10,
    },
    icon: {
        color: "white",
    },
};

const ScreenChange = ({ updateScreenLayout, screens, screen, classes }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <FormControl>
                <Select
                    style={{ color: "white" }}
                    classes={{ root: classes.root, icon: classes.icon }}
                    value={screen}
                    onChange={(event) => updateScreenLayout(event.target.value)}
                >
                    {screens.map(({ screenCode, screenDesc }) => (
                        <MenuItem key={screenCode} value={screenCode}>
                            {screenDesc}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

const StyledScreenChange = withStyles(styles)(ScreenChange);

export default StyledScreenChange;

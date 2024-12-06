import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import withStyles from "@mui/styles/withStyles";
import { useMemo } from "react";
import useUserDataStore from "@/state/useUserDataStore";

const styles = {
    root: {
        marginLeft: 10,
    },
    icon: {
        color: "white",
    },
};

const ScreenChange = ({
    updateScreenLayout,
    screenCode,
    screenId,
    classes,
}) => {
    const {
        userData: { screens },
    } = useUserDataStore();

    const selectedScreen = useMemo(
        () =>
            Object.values(screens).filter(
                ({ parentScreen }) => parentScreen === screenId
            ),
        [screens, screenId]
    );

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <FormControl>
                <Select
                    style={{ color: "white" }}
                    classes={{ root: classes.root, icon: classes.icon }}
                    value={screenCode}
                    onChange={(event) => updateScreenLayout(event.target.value)}
                >
                    {selectedScreen.map((screen) => (
                        <MenuItem
                            key={screen.screenCode}
                            value={screen.screenCode}
                        >
                            {screen.screenDesc}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

const StyledScreenChange = withStyles(styles)(ScreenChange);

export default StyledScreenChange;

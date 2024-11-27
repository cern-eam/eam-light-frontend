import { useEffect, useMemo } from "react";
import MenuWorkorder from "./common/WorkorderMenu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import withStyles from "@mui/styles/withStyles";
import MyWorkOrdersTimeFilter from "./common/MyWorkOrdersTimeFilter";
import MenuTools from "../../../MenuTools";
import useLocalStorage from "@/hooks/useLocalStorage";
import useMyTeamWorkOrdersStore from "@/state/useMyTeamWorkOrdersStore";
import useUserDataStore from "@/state/useUserDataStore";

const styles = {
    root: {
        marginLeft: 10,
    },
    icon: {
        color: "white",
    },
};

const headingStyle = {
    display: "flex",
    padding: 5,
    fontSize: 13,
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
};

const MyTeamWorkordersMenu = ({ classes }) => {
    const [days, setDays] = useLocalStorage("myteamworkorders:days", "ALL");
    const [department, setDepartment] = useLocalStorage(
        "myteamworkorders:department",
        "ALL"
    );
    const { myTeamWorkOrders, fetchMyTeamWorkOrders } =
        useMyTeamWorkOrdersStore();
    const {
        userData: { eamAccount },
    } = useUserDataStore();

    useEffect(() => fetchMyTeamWorkOrders(), []);

    const departments = useMemo(
        () => eamAccount.userDepartments,
        [eamAccount.userDepartments]
    );

    const teamWorkOrders = useMemo(
        () =>
            myTeamWorkOrders.filter(
                (wo) => department === "ALL" || wo.mrc === department
            ),
        [myTeamWorkOrders, department]
    );

    const teamWorkOrdersFiltered = useMemo(
        () => teamWorkOrders.filter(MenuTools.daysFilterFunctions[days]),
        [teamWorkOrders, days]
    );

    const sortedTeamWorkOrders = useMemo(
        () =>
            teamWorkOrdersFiltered.sort((wo1, wo2) => {
                if (
                    wo1.schedulingEndDate === null &&
                    wo2.schedulingEndDate === null
                )
                    return 0;
                if (wo1.schedulingEndDate === null) return 1;
                if (wo2.schedulingEndDate === null) return -1;
                return wo1.schedulingEndDate - wo2.schedulingEndDate;
            }),
        [teamWorkOrdersFiltered]
    );

    return (
        <ul className="layout-tab-submenu" id="myteamwos">
            <li>
                {(!departments || departments.length === 0) && (
                    <div style={headingStyle}>No department defined</div>
                )}
                {departments.length === 1 && (
                    <div style={headingStyle}>
                        WOs FOR DEP: {departments[0]}
                    </div>
                )}
                {departments.length > 1 && (
                    <div style={headingStyle}>
                        WOs FOR DEP:
                        <FormControl>
                            <Select
                                style={{ color: "white" }}
                                classes={{
                                    root: classes.root,
                                    icon: classes.icon,
                                }}
                                value={department}
                                onChange={(event) =>
                                    setDepartment(event.target.value)
                                }
                            >
                                <MenuItem value="ALL">ALL</MenuItem>
                                {departments.map((department) => (
                                    <MenuItem
                                        key={department}
                                        value={department}
                                    >
                                        {department}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
                <MyWorkOrdersTimeFilter
                    workOrders={teamWorkOrders}
                    days={days}
                    onChange={(event, value) => setDays(value)}
                />
                <ul>
                    {sortedTeamWorkOrders.map((wo) => (
                        <MenuWorkorder key={wo.number} wo={wo} />
                    ))}
                </ul>
            </li>
        </ul>
    );
};

export default withStyles(styles)(MyTeamWorkordersMenu);

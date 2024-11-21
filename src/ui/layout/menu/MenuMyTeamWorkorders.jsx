import React, {useEffect, useState} from 'react';
import MenuWorkorder from './MenuWorkorder';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import withStyles from '@mui/styles/withStyles';
import MyWorkOrdersTimeFilter from "./MyWorkOrdersTimeFilter";
import MenuTools from "./MenuTools";
import useLocalStorage from '../../../hooks/useLocalStorage';
import useMyTeamWorkOrdersStore from '../../../state/myTeamWorkOrdersStore';

const styles = {
    root: {
        marginLeft: 10,
    },
    icon: {
        color: 'white'
    },
};

const MenuMyTeamWorkorders = props =>  {
    const [days, setDays] = useLocalStorage('myteamworkorders:days', 'ALL');
    const [department, setDepartment] = useLocalStorage('myteamworkorders:department', 'ALL');
    const { myTeamWorkOrders, fetchMyTeamWorkOrders }= useMyTeamWorkOrdersStore();

    useEffect(() => {
        fetchMyTeamWorkOrders();
    }, [])

    const headingStyle = {
        display: "flex",
        padding: 5,
        fontSize: 13,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center"
    }

    const teamWorkOrders = myTeamWorkOrders.filter(wo => department === 'ALL' || wo.mrc === department);

    const generateMyTeamWorkOrders = () => {
        return teamWorkOrders
            .filter(MenuTools.daysFilterFunctions[days])
            .sort((wo1, wo2) => {
                if (wo1.schedulingEndDate === null && wo2.schedulingEndDate === null) return 0;
                if (wo1.schedulingEndDate === null) return 1;
                if (wo2.schedulingEndDate === null) return -1;
                return wo1.schedulingEndDate - wo2.schedulingEndDate;
            })
            .map(wo => (
                <MenuWorkorder key={wo.number} wo={wo} />
            ))
    }

    const renderHeading = () => {
        let departments = props.eamAccount.userDepartments;

        if (!departments || departments.length === 0) {
            return <div style={headingStyle}>No department defined</div>
        }

        if (departments.length === 1) {
            return <div style={headingStyle}>WOs FOR DEP: {departments[0]}</div>
        }

        return (
            <div style={headingStyle}>WOs FOR DEP:
                <FormControl>
                    <Select style={{color: "white"}}
                            classes={{
                                root: props.classes.root,
                                icon: props.classes.icon
                            }}
                            value={department}
                            onChange={event => setDepartment(event.target.value)}
                    >
                        <MenuItem value="ALL">ALL</MenuItem>
                        {departments.map(department => (
                            <MenuItem key={department} value={department}>{department}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        )
    }

    return (
        <ul className="layout-tab-submenu" id="myteamwos">
            <li>{renderHeading()}
                <MyWorkOrdersTimeFilter workOrders={teamWorkOrders} days={days} onChange={(event, value) => setDays(value)}/>
                <ul>
                    {generateMyTeamWorkOrders()}
                </ul>
            </li>
        </ul>
    )

}

export default withStyles(styles)(MenuMyTeamWorkorders);

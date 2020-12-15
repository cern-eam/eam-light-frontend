import React, {useState} from 'react';
import MenuWorkorder from './MenuWorkorder';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withStyles} from "@material-ui/core/styles/index";
import MyWorkOrdersTimeFilter from "./MyWorkOrdersTimeFilter";
import MenuTools from "./MenuTools";

const styles = {
    root: {
        marginLeft: 10,
    },
    icon: {
        color: 'white'
    },
};

const MenuMyTeamWorkorders = props =>  {
    const [days, setDays] = useState('ALL');
    const [department, setDepartment] = useState('ALL')

    const headingStyle = {
        display: "flex",
        padding: 5,
        fontSize: 13,
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center"
    }

    const generateMyTeamWorkOrders = () => {
        return props.myTeamWorkOrders
            .filter(MenuTools.daysFilterFunctions[days])
            .filter(wo => department === 'ALL' || wo.mrc === department)
            .sort((wo1, wo2) => {
                if (wo1.schedulingStartDate === null && wo2.schedulingStartDate === null) return 0;
                if (wo1.schedulingStartDate === null) return 1;
                if (wo2.schedulingStartDate === null) return -1;
                return wo1.schedulingStartDate - wo2.schedulingStartDate;
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
                            disableUnderline={true}
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
                <MyWorkOrdersTimeFilter days={days} onChange={(event, value) => setDays(value)}/>
                <ul>
                    {generateMyTeamWorkOrders()}
                </ul>
            </li>
        </ul>
    )

}

export default withStyles(styles)(MenuMyTeamWorkorders);

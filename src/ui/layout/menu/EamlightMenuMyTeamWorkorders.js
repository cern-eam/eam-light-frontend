import React, { Component } from 'react';
import EamlightMenuWorkorder from './EamlightMenuWorkorder';
import Tabs from '@material-ui/core/Tabs';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import StyledTab from './StyledTab'

class EamlightMenuMyTeamWorkorders extends Component {
    state = {
        days: 'ALL',
        department: 'ALL'
    };

    headingStyle = {
        display: "block",
        padding: 5,
        fontSize: 13,
        color: "#ffffff",
        textAlign: "center"
    }

    handleDaysChange = (event, value) => {
        this.setState({ days: value });
    };

    handleDepartmentChange = (event) => {
        this.setState({ department: event.target.value });
    };

    generateMyTeamWorkOrders() {
        return this.props.myTeamWorkOrders
            .filter(wo => (this.state.days === 'ALL' || wo.days === this.state.days) &&
                          (this.state.department === 'ALL' || wo.mrc === this.state.department))
            .map(wo => (
                <EamlightMenuWorkorder key={wo.number} wo={wo} />
            ))
    }

    renderHeading() {
        if (!this.props.eamAccount.userDepartments || this.props.eamAccount.userDepartments.length === 0) {
            return <div style={this.headingStyle}>No department defined</div>
        }

        if (this.props.eamAccount.userDepartments.length === 1) {
            return <div style={this.headingStyle}>WOs FOR DEPARTMENT {this.props.eamAccount.userDepartments[0]}</div>
        }

        return (
            <div style={this.headingStyle}>WOs FOR DEP.
                <FormControl>
                    <Select style={{color: "white"}}
                            classes={{
                                root: this.props.classes.root,
                                icon: this.props.classes.icon
                            }}
                            disableUnderline={true}
                            value={this.state.department}
                            onChange={this.handleDepartmentChange.bind(this)}
                    >
                        <MenuItem value="ALL">ALL</MenuItem>
                        {this.props.eamAccount.userDepartments.map(department => (
                            <MenuItem key={department} value={department}>{department}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        )
    }

    render() {
        return (
            <ul className="layout-tab-submenu" id="myteamwos">
                <li>{this.renderHeading()}
                    <Tabs
                        fullWidth
                        centered
                        value={this.state.days}
                        onChange={this.handleDaysChange}
                        indicatorColor="primary">
                        <StyledTab label="Late" value="LATE" />
                        <StyledTab label="Today" value="TODAY" />
                        <StyledTab label="Week" value="WEEK"/>
                        <StyledTab label="All" value="ALL"/>
                    </Tabs>

                    <ul>
                        {this.generateMyTeamWorkOrders()}
                    </ul>
                </li>
            </ul>
        )
    }
}

export default EamlightMenuMyTeamWorkorders;

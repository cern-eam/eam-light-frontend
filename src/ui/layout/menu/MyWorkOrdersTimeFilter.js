import React from "react";
import Tabs from '@material-ui/core/Tabs';
import StyledTab from './StyledTab'

export default function MyWorkOrdersTimeFilter(props) {

    return (
        <Tabs style={{color: "white"}}
              centered
              value={props.days}
              onChange={props.onChange}
              indicatorColor="primary">
            <StyledTab label="Late" value="LATE" />
            <StyledTab label="Today" value="TODAY" />
            <StyledTab label="Week" value="WEEK"/>
            <StyledTab label="All" value="ALL"/>
        </Tabs>
    )
}


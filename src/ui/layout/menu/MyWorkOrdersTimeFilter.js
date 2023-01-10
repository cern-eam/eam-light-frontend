import React from "react";
import StyledTab from './StyledTab';
import StyledTabs from './StyledTabs';
import MenuTools from './MenuTools';

export default function MyWorkOrdersTimeFilter(props) {
    const workOrders = props.workOrders;

    const makeTab = (type, label) => {
        const count = workOrders.filter(MenuTools.daysFilterFunctions[type]).length;
        return <StyledTab label={`${label} ${count > 99 ? '99+' : count}`} value={type} />;
    }

    return (
        <StyledTabs style={{color: "white"}}
              centered
              value={props.days}
              onChange={props.onChange}
              indicatorColor="primary">
            {makeTab('LATE', 'Late')}
            {makeTab('TODAY', 'Today')}
            {makeTab('WEEK', 'Week')}
            {makeTab('ALL', 'All')}
        </StyledTabs>
    )
}


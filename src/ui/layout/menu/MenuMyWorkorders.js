import React, {useState} from 'react';
import MenuWorkorder from './MenuWorkorder'
import MyWorkOrdersTimeFilter from './MyWorkOrdersTimeFilter'
import MenuTools from './MenuTools'
import {isToday, isPast, differenceInDays} from "date-fns";

export default function MenuMyWorkorders(props) {
    const [days, setDays] = useState('ALL')

    const generateMyOpenWorkOrders = () => {
        return props.myOpenWorkOrders
            .filter(MenuTools.daysFilterFunctions[days])
            .map(wo => (
                <MenuWorkorder key={wo.number} wo={wo} />
            ))
    }

    return (
        <ul className="layout-tab-submenu active" id="mywos">
            <li><span>MY OPEN WORK ORDERS</span>
                <MyWorkOrdersTimeFilter days={days} onChange={(event, value) => setDays(value)}/>
                <ul>
                    {generateMyOpenWorkOrders()}
                </ul>
            </li>
        </ul>
    )
}

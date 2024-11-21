import React, {useEffect, useState} from 'react';
import MenuWorkorder from './MenuWorkorder'
import MyWorkOrdersTimeFilter from './MyWorkOrdersTimeFilter'
import MenuTools from './MenuTools'
import useLocalStorage from '../../../hooks/useLocalStorage';
import useMyOpenWorkOrdersStore from '../../../state/myOpenWorkOrdersStore';

export default function MenuMyWorkorders(props) {
    const [days, setDays] = useLocalStorage('myworkorders:days', 'ALL')
    const { myOpenWorkOrders, fetchMyOpenWorkOrders }= useMyOpenWorkOrdersStore();

    useEffect(() => {
        fetchMyOpenWorkOrders();
    }, [])

    const generateMyOpenWorkOrders = () => {
        return myOpenWorkOrders
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

    return (
        <ul className="layout-tab-submenu active" id="mywos">
            <li><span>MY OPEN WORK ORDERS</span>
                <MyWorkOrdersTimeFilter workOrders={myOpenWorkOrders} days={days} onChange={(event, value) => setDays(value)}/>
                <ul>
                    {generateMyOpenWorkOrders()}
                </ul>
            </li>
        </ul>
    )
}

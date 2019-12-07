import React, {useState} from 'react';
import MenuWorkorder from './MenuWorkorder'
import MyTeamWorkOrdersTab from './MyTeamWorkOrdersTab'

export default function MenuMyWorkorders(props) {
    const [days, setDays] = useState('ALL')

    const generateMyOpenWorkOrders = () => {
        return props.myOpenWorkOrders
            .filter(wo => days === 'ALL' || wo.days === days)
            .map(wo => (
                <MenuWorkorder key={wo.number} wo={wo} />
            ))
    }

    return (
        <ul className="layout-tab-submenu active" id="mywos">
            <li><span>MY OPEN WORK ORDERS</span>
                <MyTeamWorkOrdersTab days={days} onChange={(event, value) => setDays(value)}/>
                <ul>
                    {generateMyOpenWorkOrders()}
                </ul>
            </li>
        </ul>
    )
}

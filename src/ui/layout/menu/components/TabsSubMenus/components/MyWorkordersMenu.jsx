import { useEffect, useMemo } from "react";
import MenuWorkorder from "./common/WorkorderMenu";
import MyWorkOrdersTimeFilter from "./common/MyWorkOrdersTimeFilter";
import MenuTools from "../../../MenuTools";
import useLocalStorage from "@/hooks/useLocalStorage";
import useMyOpenWorkOrdersStore from "@/state/useMyOpenWorkOrdersStore";

const MyWorkordersMenu = () => {
    const [days, setDays] = useLocalStorage("myworkorders:days", "ALL");
    const { myOpenWorkOrders, fetchMyOpenWorkOrders } =
        useMyOpenWorkOrdersStore();

    useEffect(() => fetchMyOpenWorkOrders(), []);

    const filteredWorkOrders = useMemo(() => {
        return myOpenWorkOrders.filter(MenuTools.daysFilterFunctions[days]);
    }, [myOpenWorkOrders, days]);

    const sortedWorkOrders = useMemo(() => {
        return filteredWorkOrders.sort((wo1, wo2) => {
            if (
                wo1.schedulingEndDate === null &&
                wo2.schedulingEndDate === null
            )
                return 0;
            if (wo1.schedulingEndDate === null) return 1;
            if (wo2.schedulingEndDate === null) return -1;
            return wo1.schedulingEndDate - wo2.schedulingEndDate;
        });
    }, [filteredWorkOrders]);

    return (
        <ul className="layout-tab-submenu">
            <li>
                <span>MY OPEN WORK ORDERS</span>
                <MyWorkOrdersTimeFilter
                    workOrders={myOpenWorkOrders}
                    days={days}
                    onChange={(_, value) => setDays(value)}
                />
                <ul>
                    {sortedWorkOrders.map((wo) => (
                        <MenuWorkorder key={wo.number} wo={wo} />
                    ))}
                </ul>
            </li>
        </ul>
    );
};

export default MyWorkordersMenu;

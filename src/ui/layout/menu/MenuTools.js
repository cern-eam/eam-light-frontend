import WS from '../../../tools/WS'
import {isToday, isBefore, isThisWeek, startOfToday} from "date-fns";
class MenuTools {
    refreshCache(showNotification, showError) {
        WS.refreshCache().then(response => {
            showNotification(response.body.data)
        }).catch(_ => {
            showError('EAM Light Cache Refresh has failed.')
        })
    }

    daysFilterFunctions = {
        'ALL': () => true,
        'TODAY': workOrder => (workOrder.labourScheduledDate ?? workOrder.schedulingEndDate) &&
                              isToday(workOrder.labourScheduledDate ?? workOrder.schedulingEndDate),
        'LATE': workOrder => (workOrder.labourScheduledDate ?? workOrder.schedulingEndDate) &&
                             isBefore(workOrder.labourScheduledDate ?? workOrder.schedulingEndDate, startOfToday()),
        'WEEK': workOrder =>  (workOrder.labourScheduledDate ?? workOrder.schedulingEndDate) &&
                              isThisWeek(workOrder.labourScheduledDate ?? workOrder.schedulingEndDate, { weekStartsOn: 1 }),
    }
}

export default new MenuTools();
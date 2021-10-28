import WS from '../../../tools/WS'
import {isToday, isBefore, isThisWeek, startOfToday} from "date-fns";
class MenuTools {
    refreshCache(showNotificatoin, showError) {
        WS.refreshCache().then(response => {
            showNotificatoin(response.body.data)
        }).catch(error => {
            showError('EAM Light Cache Refresh has failed.')
        })
    }

    daysFilterFunctions = {
        'ALL': () => true,
        'TODAY': workOrder => workOrder.schedulingEndDate &&
                              isToday(workOrder.schedulingEndDate),
        'LATE': workOrder => workOrder.schedulingEndDate &&
                             isBefore(workOrder.schedulingEndDate, startOfToday()),
        'WEEK': workOrder =>  workOrder.schedulingEndDate &&
                              isThisWeek(workOrder.schedulingEndDate, { weekStartsOn: 1 }),
    }
}

export default new MenuTools();
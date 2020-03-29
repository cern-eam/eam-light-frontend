import WS from '../../../tools/WS'
import {isToday, isPast, differenceInDays} from "date-fns";

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
                             isPast(workOrder.schedulingEndDate),
        'WEEK': workOrder =>  workOrder.schedulingEndDate &&
                              0 <= differenceInDays(workOrder.schedulingEndDate, new Date()) &&
                              differenceInDays(workOrder.schedulingEndDate, new Date()) < 6
    }
}

export default new MenuTools();
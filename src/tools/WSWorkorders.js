import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSWorkorders {

    //
    // WORK ORDERS
    //
    initWorkOrder(entity, params, config = {}) {
        return WS._get(`/workorders/init/${entity}${params}`, config);
    }

    getWorkOrder(number, config = {}) {
        return WS._get('/workorders/' + number, config);
    }

    createWorkOrder(workOrder, config = {}) {
        return WS._post('/workorders/', workOrder, config);
    }

    updateWorkOrder(workOrder, config = {}) {
        return WS._put('/workorders/', workOrder, config);
    }

    deleteWorkOrder(number, config = {}) {
        return WS._delete('/workorders/' + number, config);
    }

    getStandardWorkOrder(code, config = {}) {
        return WS._get('/stdworkorders/' + code, config);
    }

    autocompleteCostCode = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/wo/costcode/' + filter, config);
    };

    autocompleteStandardWorkOrder = (userGroup, filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/standardworkorder?userGroup=${encodeURIComponent(userGroup)}&s=${filter}`, config);
    };

    //
    // DROP DOWN VALUES FOR WOS
    //
    getWorkOrderStatusValues(userGroup, status, type, newWorkOrder, config = {}) {
        return WS._get(`/wolists/statuscodes?wostatus=${status}&wotype=${type}&newwo=${newWorkOrder}&userGroup=${encodeURIComponent(userGroup)}`, config)
    }

    getWorkOrderTypeValues(userGroup, config = {}) {
        return WS._get(`/wolists/typecodes?userGroup=${encodeURIComponent(userGroup)}`, config)
    }

    getWorkOrderProblemCodeValues(woclass, objclass, config = {}) {
        return WS._get('/wolists/problemcodes?woclass=' + woclass + '&objclass=' + objclass, config)
    }

    getWorkOrderActionCodeValues(objclass, failurecode, problemcode, causecode, config = {}) {
        return WS._get('/wolists/actioncodes?objclass=' + objclass + '&failurecode=' + failurecode + '&problemcode=' + problemcode + '&causecode=' + causecode, config)
    }

    getWorkOrderCauseCodeValues(objclass, failurecode, problemcode, config = {}) {
        return WS._get('/wolists/causecodes?objclass=' + objclass + '&failurecode=' + failurecode + '&problemcode=' + problemcode, config)
    }

    getWorkOrderFailureCodeValues(objclass, problemcode, config = {}) {
        return WS._get('/wolists/failurecodes?objclass=' + objclass + '&problemcode=' + problemcode, config)
    }

    getWorkOrderPriorities(config = {}) {
        return WS._get('/wolists/prioritycodes', config);
    }

    //
    //Work Order Equipment
    //
    getWorkOrderEquipmentMEC(workOrder, config = {}) {
        return WS._get('/workordersmisc/eqpmecwo/' + workOrder, config);
    }

    //
    //Children work order
    //
    getChildrenWorkOrder(workOrder, config = {}) {
        return WS._get('/workordersmisc/childrenwo/' + workOrder, config);
    }

    //
    //PART USAGE SUPPORT
    //

    createPartUsage(partUsage, config = {}) {
        return WS._post('/partusage/transaction', partUsage, config);
    }

    getPartUsageList(workorder, config = {}) {
        return WS._get('/partusage/transactions/' + workorder, config);
    }

    getInitNewPartUsage(workorder, config = {}) {
        return WS._post('/partusage/init', workorder, config);
    }

    getPartUsageStores(config = {}) {
        return WS._get('/partusage/stores', config);
    }

    getPartUsagePart(workorder, store, code, config = {}) {
        return WS._get(`/autocomplete/partusage/part/${workorder}/${store}/${code}`, config);
    }

    getPartUsageAsset(transaction, store, code, config = {}) {
        return WS._get(`/autocomplete/partusage/asset/${transaction}/${store}/${code}`, config);
    }

    getPartUsageBin(transaction, bin, part, store, config = {}) {
        return WS._get(`/partusage/bins?transaction=${transaction}&bin=${bin}&part=${part}&store=${store}`, config);
    }

    getPartUsageSelectedAsset(workorder, transaction, store, code, config = {}) {
        return WS._get(`/autocomplete/partusage/asset/complete/${workorder}/${transaction}/${store}/${code}`, config);
    }

    //
    // ACTIVITIES AND BOOKED LABOURS
    //
    getWorkOrderActivities(number, config = {}) {
        return WS._get('/activities/read/?workorder=' + number + '&includeChecklists=false', config);
    }

    // Get default values for next activity for one work order
    initWorkOrderActivity(workorderNumber, config = {}) {
        return WS._get('/activities/init/' + workorderNumber, config);
    }

    // Create a new activity for one workorder
    createWorkOrderActivity(activity, config = {}) {
        return WS._post('/activities', activity, config);
    }

    // Get default values for next activity for one work order
    initBookingLabour(workorderNumber, department, config = {}) {
        return WS._get('/bookinglabour/init/' + workorderNumber + '/' + department, config);
    }

    // Create a new activity for one workorder
    createBookingLabour(bookingLabour, config = {}) {
        return WS._post('/bookinglabour', bookingLabour, config);
    }

    getBookingLabours(workorderNumber, config = {}) {
        return WS._get("/bookinglabour/" + workorderNumber, config)
    }

    getTypesOfHours(config = {}) {
        return WS._get("/boolists/typehours", config);
    }


    autocompleteBOOEmployee = (data, config = {}) => {
        return WS._get("/autocomplete/boo/employee/" + data, config);
    };

    autocompleteBOODepartment = (data, config = {}) => {
        return WS._get("/autocomplete/boo/department/" + data, config);
    };

    autocompleteACTTrade = (data, config = {}) => {
        return WS._get("/autocomplete/act/trade/" + data, config);
    };

    autocompleteACTTask = (data, config = {}) => {
        return WS._get("/autocomplete/act/task/" + data, config);
    };

    autocompleteACTMatList = (data, config = {}) => {
        return WS._get("/autocomplete/act/matlist/" + data, config);
    };


    //
    //CHECKLIST
    //

    updateChecklistItem(checklistItem, config = {}) {
        return WS._put('/checklists/', checklistItem, config);
    }

}

export default new WSWorkorders();
import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSWorkorders {

    //
    // WORK ORDERS
    //
    initWorkOrder(config = {}) {
        return WS._get(`/workorders/init`, config);
    }

    getWorkOrder(number, config = {}) {
        return WS._get('/proxy/workorders/' + number + '%23%2A', config);
    }

    createWorkOrder(workOrder, config = {}) {
        return WS._post('/workorders/', workOrder, config);
    }

    updateWorkOrder(workOrder, config = {}) {
        return WS._put('/proxy/workorders/', workOrder, config);
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

    autocompleteStandardWorkOrder = (userGroup, equipmentClass, equipmentCategory, filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/standardworkorder?s=${filter}`, {
            ...config,
            params: {
                ...config.params,
                userGroup,
                equipmentClass,
                equipmentCategory
            }
        }
        );
    };

    autocompleteUsersWithAccess = (wo, hint = null, config = {}) => {
        return WS._get(`/autocomplete/workorders/${wo}/users/search?hint=${hint}`, config);
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

     getWorkOrderProblemCodeValues(woclass, objclass, equipment, config = {}) {
        return WS._get('/wolists/problemcodes', {
            ...config,
            params: {
                ...config.params,
                woclass,
                objclass,
                equipment
            }
        });
    }

    getWorkOrderActionCodeValues(objclass, failurecode, problemcode, causecode, equipment, config = {}) {
        return WS._get('/wolists/actioncodes', {
            ...config,
            params: {
                ...config.params,
                objclass,
                failurecode,
                problemcode,
                causecode,
                equipment
            }
        });
    }

    getWorkOrderCauseCodeValues(objclass, failurecode, problemcode, equipment, config = {}) {
        return WS._get('/wolists/causecodes', {
            ...config,
            params: {
                ...config.params,
                objclass,
                failurecode,
                problemcode,
                equipment
            }
        });
    }

    getWorkOrderFailureCodeValues(objclass, problemcode, equipment, config = {}) {
        return WS._get('/wolists/failurecodes', {
            ...config,
            params: {
                ...config.params,
                objclass,
                problemcode,
                equipment
            }
        });
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

    getEquipmentStandardWOMaxStep(eqCode, swo, config = {}) {
        return WS._get(`/equipment/${eqCode}/mtfsteps/maxstep?swo=${swo}`, config);
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

    getPartUsageAsset(transaction, store, part, code, config = {}) {
        return WS._get(`/autocomplete/partusage/asset?transaction=${transaction}&store=${store}&part=${part}&code=${code}`, config);
    }

    getPartUsageBin(transaction, bin, part, store, config = {}) {
        return WS._get(`/partusage/bins?transaction=${transaction}&bin=${bin}&part=${part}&store=${store}`, config);
    }

    getPartUsageLotIssue(lot, bin, part, store, requireAvailableQty = true, config = {}) {
        return WS._get(`/partusage/lots/issue?lot=${lot}&bin=${bin}&part=${part}&store=${store}&requireAvailableQty=${requireAvailableQty}`, config);
    }
    
    getPartUsageLotReturn(lot, part, config = {}) {
        return WS._get(`/partusage/lots/return?lot=${lot}&part=${part}`, config);
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

    // Update an activity
    updateWorkOrderActivity(activity, config = {}) {
        return WS._put('/activities', activity, config);
    }

    // Delete an activity
    deleteWorkOrderActivity(config = {}) {
        return WS._delete(`/activities`, config);
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

    //
    //TaskPlans
    //
    getTaskPlan(taskCode, config={}) {
        return WS._get('/taskplan/' + taskCode, config);
    }

    //
    //WO Equipment Details
    //
    getWOEquipLinearDetails(eqCode, config={}) {
        return WS._get(`/workordersmisc/equipment?eqCode=${encodeURIComponent(eqCode)}`, config);
    }

    //
    //AdditionalCosts
    //
    createAdditionalCost(additionalCost, workorder, config = {}) {
        return WS._post('/workorders/' + workorder + '/additionalcosts', additionalCost, config);
    }

    getAdditionalCostsList(workorder, config = {}) {
        return WS._get('/workorders/' + workorder + '/additionalcosts', config);
    }

    //
    // WO Equipment to OtherId Mapping
    //
    getWOEquipToOtherIdMapping(workorder, config={}) {
        return WS._get(`/workordersmisc/otherid/${workorder}`, config);
    }
}

export default new WSWorkorders();
import { Description } from '@mui/icons-material';
import GridRequest, { GridFilterJoiner, GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';
import { getOrg } from '../hooks/tools';

/**
 * Handles all calls to REST Api
 */
class WSWorkorders {

    //
    // WORK ORDERS
    //
    initWorkOrder(config = {}) {
        return WS._post(`/proxy/workorderdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": getOrg()}}, config);
    }

    getWorkOrder(number, organization, config = {}) {
        return WS._get(`/proxy/workorders/${encodeURIComponent(number + '#' + organization)}`, config);
    }

    createWorkOrder(workOrder, config = {}) {
        return WS._post('/proxy/workorders/', workOrder, config);
    }

    updateWorkOrder(workOrder, config = {}) {
        return WS._put('/proxy/workorders/', workOrder, config);
    }

    deleteWorkOrder(number, organization, config = {}) {
        return WS._delete(`/proxy/workorders/${encodeURIComponent(number + '#' + organization)}`, config);
    }

    getStandardWorkOrder(code, config = {}) {
        return WS._get('/proxy/standardworkorders/' + code, config);
    }

    autocompleteUsersWithAccess = (wo, hint = null, config = {}) => {
        return WS._get(`/autocomplete/workorders/${wo}/users/search?hint=${hint}`, config);
    };

    //
    // DROP DOWN VALUES FOR WOS
    //
    getWorkOrderStatusValues(oldStatus, newWorkOrder, config = {}) {
        let gridRequest = new GridRequest("LVWRSTDRP", GridTypes.LOV)
        if (newWorkOrder) {
            gridRequest.addParam("param.poldstat", "-");
			gridRequest.addParam("param.pexcclause", "C");
        } else {
			gridRequest.addParam("param.poldstat", oldStatus);
			gridRequest.addParam("param.pexcclause", "A");
        }
        gridRequest.addParam("param.pfunrentity", "EVNT");
        return getGridData(gridRequest).then(response => transformResponse(response, {code: "code", desc: "description"}));
    
    }

    getWorkOrderTypeValues(options, config = {}) {
        let gridRequest = new GridRequest("LVGROUPWOTYPE", GridTypes.LOV)
        gridRequest.addParam("parameter.pagemode", null);
		gridRequest.addParam("parameter.usergroup", options.handlerParams[0]);
        return getGridData(gridRequest).then(response => transformResponse(response, {code: "typecode", desc: "codedescription"}));
    }

    getWorkOrderPriorities(config = {}) {
        let gridRequest = new GridRequest("LVJBPR", GridTypes.LOV)
        gridRequest.addFilter("description", "Tou", "NOTCONTAINS");
        return getGridData(gridRequest).then(response => transformResponse(response, {code: "priority", desc: "description"}));
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

    getInitNewPartUsage(workorder, config = {}) {
        return WS._post('/partusage/init', workorder, config);
    }

    getPartUsageStores(config = {}) {
        let gridRequest = new GridRequest("LVIRSTOR", GridTypes.LOV, "SSISSU")
        gridRequest.addParam("param.storefield", "IR")
        gridRequest.addParam("parameter.r5role", "")
        gridRequest.sortBy("storecode")
        return getGridData(gridRequest).then(response => transformResponse(response, {code: "storecode", desc: "des_text"}));
    }

    getPartUsagePart(options, config = {}) {
        const [workorder, store] = options.handlerParams
        const code = options.filter
        return WS._get(`/autocomplete/partusage/part/${workorder}/${store}/${code}`, config);
    }

    getPartUsageAsset(options, config = {}) {
        const [transaction, store, part] = options.handlerParams
        const code = options.filter

		let gridRequest = new GridRequest("OSOBJA", GridTypes.LIST);
		gridRequest.addFilter("equipmentno", code, "CONTAINS", GridFilterJoiner.AND);

		if (part) {
			gridRequest.addFilter("part", part, "=", GridFilterJoiner.AND);
		}

		if (transaction === "ISSUE") {
			gridRequest.addFilter("store", store, "=");
		} else if (transaction ==="RETURN") {
			gridRequest.addFilter("store", "", "IS EMPTY");
		}

        return getGridData(gridRequest).then(response => transformResponse(response, {
            code: "equipmentno",
            desc: "equipmentdesc",
            org: "organization"
        }));
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


    autocompleteBOOEmployee = ({filter}, config = {}) => {
        return WS._get("/autocomplete/boo/employee/" + filter, config);
    };

    autocompleteACTTrade = ({filter}, config = {}) => {
        return WS._get("/autocomplete/act/trade/" + filter, config);
    };

    autocompleteACTTask = ({filter}, config = {}) => {
        return WS._get("/autocomplete/act/task/" + filter, config);
    };

    autocompleteACTMatList = ({filter}, config = {}) => {
        return WS._get("/autocomplete/act/matlist/" + filter, config);
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

    myWorkOrderMapper = {
        number: "workordernum",
        org: 'organization',
        desc: "description",
        status: "workorderstatus_display",
        object: "equipment",
        mrc: "department",
        type: "workordertype_display",
        priority: "priority_display",
        createdDate: "datecreated",
        schedulingStartDate:  (wo) => wo.schedstartdate ? new Date(wo.schedstartdate).getTime() : null,
        schedulingEndDate: (wo) => wo.schedenddate ? new Date(wo.schedenddate).getTime() : null
    }

    scheduledWorkOrderMapper = {
        number: "workordernum",
        desc: "acsactivity_display",
        object: "equipment",
        mrc: "department",
        org: () => '*',
        labourScheduledDate: (wo) => wo.acssched ? new Date(wo.acssched).getTime() : null,
        schedulingEndDate: (wo) => wo.schedenddate ? new Date(wo.schedenddate).getTime() : null
    }

    getAssignedWorkOrders(employee) {
        let gridRequest = new GridRequest("WSJOBS", GridTypes.LIST, "WSJOBS")
        gridRequest.rowCount = 100
        gridRequest.addFilter("assignedto", employee, "=", "AND")
        gridRequest.addFilter("evt_rstatus", "R", "=", "AND")
        gridRequest.sortBy("schedenddate")
        return getGridData(gridRequest).then(response => transformResponse(response, this.myWorkOrderMapper));
    }

    getMyTeamWorkOrders(userDepartments) {
        let gridRequest = new GridRequest("WSJOBS", GridTypes.LIST, "WSJOBS")
        gridRequest.rowCount = 100
        gridRequest.addFilter("department", userDepartments, "IN", "AND")
        gridRequest.addFilter("evt_rstatus", "R", "=", "AND")
        return getGridData(gridRequest).then(response => transformResponse(response, this.myWorkOrderMapper));
    }

    getScheduledWorkOrders() {
        let gridRequest = new GridRequest("WUSCHE", GridTypes.LIST)
        gridRequest.sortBy("acssched")
        return getGridData(gridRequest).then(response => transformResponse(response, this.scheduledWorkOrderMapper));
    }

}

export default new WSWorkorders();
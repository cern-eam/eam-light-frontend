import useUserDataStore from '../state/useUserDataStore';
import { GridFilterJoiner, GridRequest, GridType, transformNativeResponse, transformResponse } from 'eam-rest-tools';
import WS from './WS';
import { getOrg } from '../hooks/tools';

export const getGridDataNative = (gridRequest, config = {}) => WS._post('/proxy/grids', gridRequest, config);

export const getGridData = (gridRequest, config = {}) => 
    getGridDataNative(gridRequest, config)
      .then(transformNativeResponse)
      .catch((error) => {
        if (!error?.type === "REQUEST_CANCELLED") {
            console.error("Error when fetching / transforming", gridRequest, error)
            return { body: { data: [] } }
        }
    });


export const readStatuses = (options) => {
    let entity = options.handlerParams[0]
    let newEntity = options.handlerParams[1]
    let oldStatus = options.handlerParams[2]
    let userData = useUserDataStore.getState().userData

    const gridRequest = new GridRequest("BSAUTH_HDR")
        .addFilter("usergroupcode", userData.eamAccount.userGroup, "=", GridFilterJoiner.OR, true, false)
        .addFilter("usercode", userData.eamAccount.userCode, "=", GridFilterJoiner.AND, false, true)
        .addFilter("entity", entity, "=");

    if (newEntity || !oldStatus) {
        gridRequest.addFilter("fromstatus", "-", "=")
    } else {
        gridRequest.addFilter("fromstatus", oldStatus, "=")
    }

    return getGridData(gridRequest).then(response => transformResponse(response, {code: "tostatus", desc: "tostatusdesc"}, 
        (newEntity && response.body.data.length > 0 || !oldStatus) ? [] : [{ code: oldStatus, desc: response.body.data[0].fromstatusdesc }]
    ));

}

export const readUserCodes = (options) => {
    const gridRequest = new GridRequest("BSUCOD_HDR")
        .addParam("param.entitycode", options.handlerParams[0])
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "usercode", systemCode: "systemcode", desc: "usercodedescription"}));
}

export const autocompleteDepartment = (options) => {
    const gridRequest = new GridRequest("LVMRCS", GridType.LOV, "LVMORCS", 100)
    gridRequest.rowCount = 10
    gridRequest
        .addParam("param.showstardepartment", null)
        .addParam("param.bypassdeptsecurity", null)
        .addFilter("department", options.filter, "CONTAINS")
        .sortBy("department")
        .addParam("control.org", getOrg())
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "department", desc: "des_text"}));
}

export const getPartUsageList = (workorder, config = {}) => {
    const gridRequest = new GridRequest("WSJOBS_PAR", GridType.LIST, "WSJOBS")
        .addParam("param.workordernum", workorder)
        .addParam("param.headeractivity", "0")
        .addParam("param.headerjob", "0")
        .addFilter("plannedqty", "0", "!=", GridFilterJoiner.OR)
        .addFilter("reservedqty", "0", "!=", GridFilterJoiner.OR)
        .addFilter("allocatedqty", "0", "!=", GridFilterJoiner.OR)
        .addFilter("usedqty", "0", "!=", GridFilterJoiner.OR);

    return getGridData(gridRequest).then(response => transformResponse(response, {
        partCode: "partcode",
        partDesc: "partdescription",
        plannedQty: "plannedqty",
        usedQty: "usedqty",
        activityDesc: "activity_display",
        storeCode: "storecode",
        partUoM: "partuom"
      }));

}
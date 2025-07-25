import useUserDataStore from '../state/useUserDataStore';
import { transformNativeResponse } from './GridTools';
import WS from './WS';
import GridRequest, { GridFilterJoiner } from './entities/GridRequest';
import { GridTypes } from './entities/GridRequest';
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


export function transformResponse(response, keyMap, additionalData = []) {
    return {
        body: {
            data: [
                ...response.body.data.map(item => 
                    Object.fromEntries(Object.entries(keyMap).map(([newKey, oldKey]) => [newKey, typeof oldKey === 'function' ? oldKey(item) : item[oldKey]]))
                ),
                ...additionalData
            ]
        }
    };
}

export const readStatuses = (options) => {
    let entity = options.handlerParams[0]
    let newEntity = options.handlerParams[1]
    let oldStatus = options.handlerParams[2]
    let userData = useUserDataStore.getState().userData

    let gridRequest = new GridRequest("BSAUTH_HDR")
    gridRequest.addFilter("usergroupcode", userData.eamAccount.userGroup, "=", "OR", true, false)
    gridRequest.addFilter("usercode", userData.eamAccount.userCode, "=", "AND", false, true)
    gridRequest.addFilter("entity", entity, "=")
    
    if (newEntity) {
        gridRequest.addFilter("fromstatus", "-", "=")
    } else {
        gridRequest.addFilter("fromstatus", oldStatus, "=")
    }

    return getGridData(gridRequest).then(response => transformResponse(response, {code: "tostatus", desc: "tostatusdesc"}, 
        newEntity && response.body.data.length > 0 ? [] : [{ code: oldStatus, desc: response.body.data[0].fromstatusdesc }]
    ));

}

export const readUserCodes = (options) => {
    let gridRequest = new GridRequest("BSUCOD_HDR")
    gridRequest.addParam("param.entitycode", options.handlerParams[0])
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "usercode", systemCode: "systemcode", desc: "usercodedescription"}));
}

export const autocompleteDepartment = (options) => {
    let gridRequest = new GridRequest("LVMRCS", GridTypes.LOV)
    gridRequest.rowCount = 10
    gridRequest.addParam("param.showstardepartment", null)
    gridRequest.addParam("param.bypassdeptsecurity", null)
    gridRequest.addFilter("department", options.filter, "CONTAINS")
    gridRequest.sortBy("department")
    gridRequest.addParam("control.org", getOrg())
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "department", desc: "des_text"}));
}

export const getPartUsageList = (workorder, config = {}) => {
    let gridRequest = new GridRequest("WSJOBS_PAR", GridTypes.LIST, "WSJOBS")
    gridRequest.addParam("param.workordernum", workorder);
    gridRequest.addParam("param.headeractivity", "0");
    gridRequest.addParam("param.headerjob", "0");

    gridRequest.addFilter("plannedqty", "0", "!=", GridFilterJoiner.OR);
    gridRequest.addFilter("reservedqty", "0", "!=", GridFilterJoiner.OR);
    gridRequest.addFilter("allocatedqty", "0", "!=", GridFilterJoiner.OR);
    gridRequest.addFilter("usedqty", "0", "!=", GridFilterJoiner.OR);

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
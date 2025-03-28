import useUserDataStore from '../state/useUserDataStore';
import WS from './WS';
import GridRequest, {GridTypes} from './entities/GridRequest';

export const getGridData = (gridRequest, config = {}) => WS._post('/grids/datamap', gridRequest, config);

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

export const readStatuses = (entity, newEntity, oldStatus) => {
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

export const readUserCodes = (entity) => {
    let gridRequest = new GridRequest("BSUCOD_HDR")
    gridRequest.addParam("param.entitycode", entity)
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "usercode", desc: "usercodedescription"}));
}

export const autocompleteDepartment = (organization, hint) => {
    let gridRequest = new GridRequest("LVMRCS", GridTypes.LOV)
    gridRequest.rowCount = 10
    gridRequest.addParam("param.showstardepartment", null)
    gridRequest.addParam("param.bypassdeptsecurity", null)
    gridRequest.addFilter("department", hint?.toUpperCase(), "CONTAINS")
    gridRequest.sortBy("department")
    gridRequest.addParam("control.org", organization)
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "department", desc: "des_text"}));
}
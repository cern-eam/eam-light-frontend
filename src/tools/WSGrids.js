import useUserDataStore from '../state/useUserDataStore';
import WS from './WS';
import GridRequest from './entities/GridRequest';

export const getGridData = (gridRequest, config = {}) => WS._post('/grids/datamap', gridRequest, config);

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

export function transformResponse(response, keyMap, additionalData = []) {
    return {
        body: {
            data: [
                ...response.body.data.map(item => 
                    Object.fromEntries(Object.entries(keyMap).map(([newKey, oldKey]) => [newKey, item[oldKey]]))
                ),
                ...additionalData
            ]
        }
    };
}

export const readUserCodes = (entity) => {
    let gridRequest = new GridRequest("BSUCOD_HDR")
    gridRequest.addParam("param.entitycode", entity)
    return getGridData(gridRequest).then(response => transformResponse2(response, {code: "usercode", desc: "usercodedescription"}));
}
import useUserDataStore from '../state/useUserDataStore';
import WS from './WS';
import GridRequest from './entities/GridRequest';

export const data = (gridRequest, config = {}) => WS._post('/grids/datamap', gridRequest, config);

export const readStatuses = (entity, newEntity, oldStatus) => {
    let userData = useUserDataStore.getState().userData

    let gridRequest = new GridRequest("BSAUTH_HDR")
    gridRequest.gridType = "LIST"
    gridRequest.addFilter("usergroupcode", userData.eamAccount.userGroup, "=", "OR", true, false)
    gridRequest.addFilter("usercode", userData.eamAccount.userCode, "=", "AND", false, true)
    gridRequest.addFilter("entity", entity, "=")
    
    if (newEntity) {
        gridRequest.addFilter("fromstatus", "-", "=")
    } else {
        gridRequest.addFilter("fromstatus", oldStatus, "=")
    }

    return data(gridRequest).then(response => ({
        body: {
            data: [
                ...response.body.data.map(({ tostatus, tostatusdesc }) => ({ code: tostatus, desc: tostatusdesc })),
                ...(newEntity && response.body.data.length > 0 ? [] : [{ code: oldStatus, desc: response.body.data[0].fromstatusdesc }]) // Add current status
            ]
        }
    }));
}
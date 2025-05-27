import { getOrg } from '../hooks/tools';
import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';

export const initPart = (config = {}) => {
    return WS._post(`/proxy/partdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": getOrg()}}, config)
}

export const getPart = (number, organization, config = {}) => {
    return WS._get(`/proxy/parts/${encodeURIComponent(number + '#' + organization)}`, config);
}

export const createPart = (part, config = {}) => {
    return WS._post('/proxy/parts/', part, config);
}

export const updatePart = (part, config = {}) => {
    return WS._put('/proxy/parts/', part, config);
}

export const deletePart = (number, organization, config = {}) => {
    return WS._delete('/proxy/parts/' + number+ '%23' + organization, config);
}

export const getPartTrackingMethods = (config = {}) => {
    const gridRequest = new GridRequest("LVTRACK", GridTypes.LOV)
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "trackingtype", desc: "description"}));
}

export const getAssetsList = (partCode, config = {}) => {
    let gridRequest = new GridRequest("OSOBJA", GridTypes.LIST, "OSOBJA")
    gridRequest.addFilter("part", partCode, "=");
    return getGridData(gridRequest, config)
}

import { encodeCodeOrg, getCodeOrg, getOrg } from '../hooks/tools';
import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';

export const initPart = (config = {}) => {
    return WS._post(`/proxy/partdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": getOrg()}}, config)
}

export const getPart = (partIdentifier, config = {}) => {
    return WS._get(`/proxy/parts/${encodeCodeOrg(partIdentifier)}`, config);
}

export const createPart = (part, config = {}) => {
    return WS._post('/proxy/parts/', part, config);
}

export const updatePart = (part, config = {}) => {
    return WS._put('/proxy/parts/', part, config);
}

export const deletePart = (partIdentifier, config = {}) => {
    return WS._delete(`/proxy/parts/${encodeCodeOrg(partIdentifier)}`, config);
}

export const createManufacturer = (manufacturer, config = {}) => {
    return WS._post('/proxy/manufacturers/', manufacturer, config);
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

// Lot web services
export const initLot = (config = {}) => {
    return WS._post(`/proxy/lotdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": getOrg()}}, config)
}

export const getLot = (lotIdentifier, config = {}) => {
    return WS._get(`/proxy/lots/${encodeCodeOrg(lotIdentifier)}`, config);
}

export const createLot = (lot, config = {}) => {
    return WS._post('/proxy/lots/', lot, config);
}

export const updateLot = (lot, config = {}) => {
    return WS._put('/proxy/lots/', lot, config);
}

export const deleteLot = (lotIdentifier, config = {}) => {
    return WS._delete(`/proxy/lots/${encodeCodeOrg(lotIdentifier)}`, config);
}

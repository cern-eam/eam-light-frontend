import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';
import { parse } from 'date-fns'

const toIsoUtc = (input, format = 'dd-MMM-yyyy') => new Date(parse(input, format, new Date())).toISOString()

export const autocompleteCustomFieldRENT = ({handlerParams: [entityCode, rentCodeValue, cfcode], filter}, config = {}) => {
    let gridRequest = new GridRequest("LVCFE", GridTypes.LOV)
    gridRequest.setRowCount(10)
    gridRequest.addParam("param.fieldid", prepareCode(cfcode));
    gridRequest.addParam("param.associatedrentity", entityCode)
    gridRequest.addParam("param.lookuprentity", rentCodeValue)
    gridRequest.addParam("parameter.propentity", rentCodeValue)
    gridRequest.addFilter("customfieldvalue", filter, "BEGINS", "OR")
    gridRequest.addFilter("description", filter, "BEGINS")
    return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "customfieldvalue", desc: "description"}))
};

export const cfChar = (code) => {
    let gridRequest = new GridRequest("LVCFV", GridTypes.LOV)
    gridRequest.addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue"}))
}

export const cfDate = (code) => {
    let gridRequest = new GridRequest("LVCFD", GridTypes.LOV)
    gridRequest.addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {
        code: val => toIsoUtc(val.customfieldvalue),
        desc: "customfieldvalue"
    }))
}

export const cfDateTime = (code) => {
    let gridRequest = new GridRequest("LVCFDT", GridTypes.LOV)
    gridRequest.addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {
        code: val => toIsoUtc(val.customfieldvalue, 'dd-MMM-yyyy HH:mm'),
        desc: "customfieldvalue"
    }))
}

export const cfNum = (code) => {
    let gridRequest = new GridRequest("LVCFN", GridTypes.LOV)
    gridRequest.addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue"}))
}

export const cfCodeDesc = (code) => {
    let gridRequest = new GridRequest("LVCFCD", GridTypes.LOV)
    gridRequest.addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue", desc: "description"}))
}

export const getCustomFields = (entityCode, classCode, config = {}) => {
    return WS._get(`/proxy/customfields?entityCode=${entityCode}&classCode=${classCode ? encodeURIComponent(classCode) : ""}`, config)
}

const prepareCode = (code) => {
    return code.split("-").join("-0045");
}
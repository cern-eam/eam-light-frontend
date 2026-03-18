import { GridFilterJoiner, GridRequest, GridType, transformResponse } from 'eam-rest-tools';
import WS from './WS';
import { getGridData } from './WSGrids';
import { parse } from 'date-fns'

const toIsoUtc = (input, format = 'dd-MMM-yyyy') => new Date(parse(input, format, new Date())).toISOString()

export const autocompleteCustomFieldRENT = ({handlerParams: [entityCode, rentCodeValue, cfcode], filter}, config = {}) => {
    const gridRequest = new GridRequest("LVCFE", GridType.LOV)
        .setRowCount(10)
        .addParam("param.fieldid", prepareCode(cfcode))
        .addParam("param.associatedrentity", entityCode)
        .addParam("param.lookuprentity", rentCodeValue)
        .addParam("parameter.propentity", rentCodeValue)
        .addFilter("customfieldvalue", filter, "BEGINS", GridFilterJoiner.OR)
        .addFilter("description", filter, "BEGINS")
    return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "customfieldvalue", desc: "description"}))
};

export const cfChar = ({handlerParams: [code]}) => {
    const gridRequest = new GridRequest("LVCFV", GridType.LOV)
        .addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue"}))
}

export const cfDate = ({handlerParams: [code]}) => {
    const gridRequest = new GridRequest("LVCFD", GridType.LOV)
        .addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {
        code: val => toIsoUtc(val.customfieldvalue),
        desc: "customfieldvalue"
    }))
}

export const cfDateTime = ({handlerParams: [code]}) => {
    const gridRequest = new GridRequest("LVCFDT", GridType.LOV)
        .addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {
        code: val => toIsoUtc(val.customfieldvalue, 'dd-MMM-yyyy HH:mm'),
        desc: "customfieldvalue"
    }))
}

export const cfNum = ({handlerParams: [code]}) => {
    const gridRequest = new GridRequest("LVCFN", GridType.LOV)
        .addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue"}))
}

export const cfCodeDesc = ({handlerParams: [code]}) => {
    const gridRequest = new GridRequest("LVCFCD", GridType.LOV)
        .addParam("param.propcode", prepareCode(code))
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue", desc: "description"}))
}

export const getCustomFields = (entityCode, classCode, config = {}) => {
    return WS._get(`/proxy/customfields?entityCode=${entityCode}&classCode=${classCode ? encodeURIComponent(classCode) : ""}`, config)
}

const prepareCode = (code) => {
    return code.split("-").join("-0045");
}
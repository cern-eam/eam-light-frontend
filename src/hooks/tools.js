import { get } from "lodash";
import { fromEAMDate, fromEAMNumber, fromEAMCheckbox, toEAMDate, toEAMNumber } from "../ui/pages/EntityTools";
import GridRequest, { GridTypes } from "../tools/entities/GridRequest";
import { getGridData, transformResponse } from "../tools/WSGrids";
import set from "set-value";
import useUserDataStore from "../state/useUserDataStore";
import useInforContextStore from "../state/useInforContext";

export const toEAMValue = (value, type) => {
    switch(type) {
        case "date":
        case "datetime":
            return toEAMDate(value)
        case "number":
        case "currency":
            return toEAMNumber(value)
        default:
            return value;
    }
}

export const fromEAMValue = (value, type) => {
    switch(type) {
        case "date":
        case "datetime":
            return fromEAMDate(value)
        case "number":
        case "currency":
            return fromEAMNumber(value)
        case "checkbox":
            return fromEAMCheckbox(value)
        default:
            return value;
    }
}

export const fromEAMDefaultValue = (value, type) => {
    // TODO support dates (format used by EAM: '06/17/2025 14:30')
    switch(type) {
        case "checkbox":
            return fromEAMCheckbox(value)
        default:
            return value;
    }
}

export const assignDefaultValues = (entity, layout) => {
    const exclusions = ['esthrs', 'pplreq']
    Object.values(layout.fields)
        .filter(field => field.defaultValue && field.xpath && !exclusions.includes(field.elementId))
        .forEach(field => set(entity, field.xpath, field.defaultValue === "NULL" ? null : fromEAMDefaultValue(field.defaultValue, field.fieldType)))
    return entity;
};

export const appendPath = (input, suffix) => {
    const exclusions = ['UserDefinedFields', '.DESCRIPTION']
    if (exclusions.some(item => input?.includes(item))) {
        return null;
    }
    // Replace the last segment of a dot-separated path with the given suffix (for example, transform 'x.y.z' into 'x.y.[suffix]'.
    return /\./.test(input) ? input.replace(/\.[^.]+$/, `.${suffix}`) : null;
}

const generateResultMap = (returnFields = {}, elementInfo) => ({
    code: returnFields[elementInfo.elementId] ?? Object.values(returnFields).find(value => value.includes('code')),
    desc: Object.values(returnFields).find(value => value.includes('desc')) ?? "des_text",
    organization: Object.values(returnFields).find(value => value.includes('organization'))
})

export const createAutocompleteHandler = (elementInfo, fields, entity, autocompleteHandlerData = {}) => {
    if (!elementInfo || !elementInfo.onLookup || elementInfo.onLookup == "{}" ) {
        return;
    } 

    const { lovName, inputVars, inputFields, returnFields = [] } = JSON.parse(elementInfo.onLookup)
    const { gridType, searchKeys, resultMap, userFunctionName, extraData} = autocompleteHandlerData;

    const autocompleteHandler = (options, config) => {
        try {
            let {operator = "BEGINS", filter} = options;
            filter = (typeof filter === "string") ? filter : ""

            const gridRequest = new GridRequest(lovName, gridType ?? GridTypes.LOV, userFunctionName)
            
            // Parameters 
            Object.entries(inputFields ?? {}).forEach(([key, value]) => { 
                if (key === 'param.group') {
                    gridRequest.addParam(key, useUserDataStore.getState().userData.eamAccount.userGroup)
                } else {
                    gridRequest.addParam(key, get(entity, fields[value]?.xpath) ?? extraData?.[value])
                }
            });
            Object.entries(inputVars ?? {}).forEach(([key, value]) => { 
                gridRequest.addParam(key, value)
            });
            gridRequest.addParam("param.pagemode", "display")

            const searchFields = searchKeys ?? [returnFields[elementInfo.elementId]] ?? [];

            // filter implies autocomplete so limit the row count to 10
            if (filter) {
                searchFields.forEach(searchField => gridRequest.addFilter(searchField, filter, operator, "OR"))
                gridRequest.setRowCount(10)
            } 

            return getGridData(gridRequest, config).then(response => transformResponse(response, resultMap ?? generateResultMap(returnFields, elementInfo)));
        } catch (error) {
            console.error('autocompleteHandler error', error)
        }
    }

    const renderDependencies = Object.values(inputFields ?? {}).map(inputField => get(entity, fields[inputField]?.xpath) ?? extraData?.[inputField])

    return {autocompleteHandler, renderDependencies}

}

export const getCodeOrg = (codeorg) => {
    if (!codeorg) {
        return {}
    }
    const defaultOrg = getOrg()
    let [code, org = defaultOrg] = decodeURIComponent(codeorg).split("#");
    return {code, org}
}

export const getOrg = () => {
    const {inforContext} = useInforContextStore.getState();
    return inforContext ? inforContext.INFOR_ORGANIZATION : '*'
}
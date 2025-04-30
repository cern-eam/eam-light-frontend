import { get } from "lodash";
import { fromEAMDate, fromEAMNumber, toEAMDate, toEAMNumber } from "../ui/pages/EntityTools";
import GridRequest, { GridTypes } from "../tools/entities/GridRequest";
import { getGridData, transformResponse } from "../tools/WSGrids";
import queryString from "query-string";
import set from "set-value";
import useUserDataStore from "../state/useUserDataStore";

export const toEAMValue = (value, type) => {
    switch(type) {
        case "date":
        case "datetime":
            return toEAMDate(value)
        case "number":
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
            return fromEAMNumber(value)
        default:
            return value;
    }
}

export const assignQueryParamValues = (entity, screenLayout) => {
    let queryParams = queryString.parse(window.location.search);
    Object.entries(queryParams).forEach(([key, value]) => {
      const elementInfo = screenLayout.fields[key]
      if (elementInfo && elementInfo.xpath && value) {
        set(entity, elementInfo.xpath, toEAMValue(value, elementInfo.fieldType))
      }
    })
    // TODO: custom fields, date and numbers
    return entity;
};

export const fireHandlersForQueryParamValues = (screenLayout, fireHandler) => {
    let queryParams = queryString.parse(window.location.search);
    Object.entries(queryParams).forEach(([key, value]) => {
      const elementInfo = screenLayout.fields[key]
      if (elementInfo && elementInfo.xpath && value) {
        fireHandler(elementInfo.xpath, value)
      }
    }) 
}

export const assignDefaultValues = (entity, layout) => {
    const exclusions = ['esthrs', 'pplreq']
    Object.values(layout.fields)
        .filter(field => field.defaultValue && field.xpath && !exclusions.includes(field.elementId))
        .forEach(field => set(entity, field.xpath, field.defaultValue === "NULL" ? null : field.defaultValue))
    return entity;
};

const generateResultMap = (returnFields = {}, elementInfo) => ({
    code: returnFields[elementInfo.elementId] ?? Object.values(returnFields).find(value => value.includes('code')),
    desc: Object.values(returnFields).find(value => value.includes('desc')) ?? "des_text",
    organization: Object.values(returnFields).find(value => value.includes('organization'))
})

export const createAutocompleteHandler = (elementInfo, fields, entity, autocompleteHandlerData = {}) => {
    if (!elementInfo || !elementInfo.onLookup || elementInfo.onLookup == "{}" ) {
        return;
    } 

    const { lovName, inputVars, inputFields, returnFields } = JSON.parse(elementInfo.onLookup)

    const autocompleteHandler = (options, config) => {
        try {
            const {operator = "BEGINS", filter} = options;
            const gridRequest = new GridRequest(lovName, autocompleteHandlerData.gridType ?? GridTypes.LOV)
            gridRequest.setRowCount(10)
            
            // Parameters 
            Object.entries(inputFields ?? {}).forEach(([key, value]) => { 
                if (key === 'param.group') {
                    gridRequest.addParam(key, useUserDataStore.getState().userData.eamAccount.userGroup)
                } else {
                    gridRequest.addParam(key, get(entity, fields[value]?.xpath))
                }
            });
            Object.entries(inputVars ?? {}).forEach(([key, value]) => { 
                gridRequest.addParam(key, value)
            });
            gridRequest.addParam("param.pagemode", "display")

            const searchFields = autocompleteHandlerData.searchKeys ?? [returnFields[elementInfo.elementId]] ?? [];
            searchFields.forEach(searchField => gridRequest.addFilter(searchField, typeof filter === "string" ? filter : "", operator, "OR"))

            return getGridData(gridRequest, config).then(response => transformResponse(response, autocompleteHandlerData.resultMap ?? generateResultMap(returnFields, elementInfo)));
        } catch (error) {
            console.error('autocompleteHandler error', error)
        }
    }

    const renderDependencies = Object.values(inputFields ?? {}).map(inputField => get(entity, fields[inputField]?.xpath))

    return {autocompleteHandler, renderDependencies}

}
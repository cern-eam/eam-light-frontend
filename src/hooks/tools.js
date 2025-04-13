import { get } from "lodash";
import { toEAMDate, toEAMNumber } from "../ui/pages/EntityTools";
import GridRequest, { GridTypes } from "../tools/entities/GridRequest";
import { getGridData, transformResponse } from "../tools/WSGrids";
import queryString from "query-string";
import set from "set-value";

export const convertValue = (value, type) => {
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

export const assignQueryParamValues = (entity, screenLayout) => {
    let queryParams = queryString.parse(window.location.search, screenLayout);
    Object.entries(queryParams).forEach(([key, value]) => {
      const elementInfo = screenLayout.fields[key]
      if (elementInfo && elementInfo.xpath && value) {
        set(entity, elementInfo.xpath, convertValue(value, elementInfo.fieldType))
      }
    })
    // TODO: custom fields, date and numbers
    return entity
};

export const assignDefaultValues = (entity, layout) => {
    const exclusions = ['esthrs', 'pplreq']
    Object.values(layout.fields)
        .filter(field => field.defaultValue && field.xpath && !exclusions.includes(field.elementId))
        .forEach(field => set(entity, field.xpath, field.defaultValue === "NULL" ? null : field.defaultValue))
    return entity;
};

 const generateResultMap = (returnFields = {}) => ({
        code: Object.values(returnFields).find(value => value.includes('code')),
        desc: Object.values(returnFields).find(value => value.includes('desc')) ?? "des_text",
        organization: Object.values(returnFields).find(value => value.includes('organization'))
    })

export const createAutocompleteHandler = (elementInfo, fields, entity, autocompleteHandlerData = {}) => {

    if (!elementInfo || !elementInfo.onLookup || elementInfo.onLookup == "{}" ) {
        return;
    } 

    const { lovName, inputVars, inputFields, returnFields } = JSON.parse(elementInfo.onLookup)

    const autocompleteHandler = (hint, config) => {

        try {
        
        const gridRequest = new GridRequest(lovName, autocompleteHandlerData.gridType ?? GridTypes.LOV)
        gridRequest.setRowCount(10)
        
        //
        // Parameters 
        //
        Object.entries(inputFields ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, get(entity, fields[value]?.xpath))
        });

        Object.entries(inputVars ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, value)
        });
        
        gridRequest.addParam("param.pagemode", "view")

        //
        //
        //
        const searchFields = autocompleteHandlerData.searchKeys ?? Object.values(returnFields ?? {});
        searchFields.forEach(searchField => gridRequest.addFilter(searchField, typeof hint === "string" ? hint : "", "BEGINS", "OR"))
        
        return getGridData(gridRequest, config).then(response => transformResponse(response, autocompleteHandlerData.resultMap ?? generateResultMap(returnFields)));
    } catch (error) {
        console.error('error', error)
    }
    }

    const renderDependencies = Object.values(inputFields ?? {}).map(inputField => get(entity, fields[inputField]?.xpath))

    return {autocompleteHandler, renderDependencies}

}
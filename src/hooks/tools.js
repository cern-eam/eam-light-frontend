import { get } from "lodash";
import { toEAMDate, toEAMNumber } from "../ui/pages/EntityTools";
import GridRequest, { GridTypes } from "../tools/entities/GridRequest";
import { getGridData, transformResponse } from "../tools/WSGrids";

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

export const createAutocompleteHandler = (elementInfo, fields, entity, autocompleteHandlerData) => {

    if (!elementInfo || !elementInfo.onLookup || elementInfo.onLookup == "{}" ) {
        return;
    } 

    const { lovName, inputVars, inputFields, returnFields } = JSON.parse(elementInfo.onLookup)

    const autocompleteHandler = (hint, config) => {

        try {
        
        const gridRequest = new GridRequest(lovName, autocompleteHandlerData?.gridType ?? GridTypes.LOV)
        gridRequest.setRowCount(10)
        Object.entries(inputFields ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, get(entity, fields[value]?.xpath))
        });

        Object.entries(inputVars ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, value)
        });
        
        gridRequest.addParam("param.pagemode", "view")

        const searchFields = autocompleteHandlerData?.searchKeys ?? Object.keys(returnFields ?? {});
        searchFields.forEach(searchField => gridRequest.addFilter(searchField, typeof hint === "string" ? hint : "", "BEGINS", "OR"))
        
        return getGridData(gridRequest, config).then(response => transformResponse(response, autocompleteHandlerData.resultMap));
    } catch (error) {
        console.error('error', error)
    }
    }

    const renderDependencies = Object.values(inputFields ?? {}).map(inputField => get(entity, fields[inputField]?.xpath))

    return {autocompleteHandler, renderDependencies}

}
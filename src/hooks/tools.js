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

    return (hint, config) => {
        const { lovName, inputVars, inputFields, returnFields } = JSON.parse(elementInfo.onLookup)

        const gridRequest = new GridRequest(lovName, GridTypes.LOV)
        gridRequest.setRowCount(10)

        Object.entries(inputFields ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, get(entity, fields[value]?.xpath))
        });

        Object.entries(inputVars ?? {}).forEach(([key, value]) => { 
            gridRequest.addParam(key, value)
        });

        //gridRequest.addParam("param.pagemode", "view")

        (autocompleteHandlerData?.searchKeys ?? Object.keys(returnFields)).forEach(returnField => gridRequest.addFilter(returnField, typeof hint === "string" ? hint : "", "BEGINS", "OR"))
        console.log('firing', gridRequest, autocompleteHandlerData)
        return getGridData(gridRequest).then(response => transformResponse(response, autocompleteHandlerData.resultMap));
    }
}
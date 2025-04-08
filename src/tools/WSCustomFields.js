import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';

/**
 * Handles all calls to REST Api
 */
class WSCustomFields {

    //
    //CUSTOM FIELDS SUPPORT
    //

    getCustomFieldsLookupValues(entity, inforClass, config = {}) {
        return WS._get('/customfields/lookupvalues?entity=' + entity + '&inforClass=' + inforClass, config);
    }

    autocompleteCustomFieldRENT = (entityCode, rentCodeValue, cfcode, filter, config = {}) => {
        return WS._get(`/customfields/autocomplete/${entityCode}/${rentCodeValue}/${cfcode}/${filter}`, config);
    };

    getCustomFields(entity, classCode, config = {}) {
        return WS._get(`/customfields/data?entity=${entity}&inforClass=${classCode ? encodeURIComponent(classCode) : ""}`, config);
    }

    


}


export const cfCodeDesc = (code) => {
    let gridRequest = new GridRequest("LVCFCD", GridTypes.LOV)
    gridRequest.addParam("param.propcode", code)
    return getGridData(gridRequest).then(response => transformResponse(response, {code: "customfieldvalue", desc: "description"}));
}

export default new WSCustomFields();
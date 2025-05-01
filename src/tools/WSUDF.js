import GridRequest, { GridTypes } from './entities/GridRequest';
import { getGridData, transformResponse } from './WSGrids';

/**
 * Handles all calls to REST Api
 */
class WSUDF {

    //
    //USER DEFINED FIELDS Support
    //

    autocompleteUserDefinedField = (options, config = {}) => {
        let entity = options.handlerParams[0]
        let filter = options.filter
        let gridRequest = new GridRequest("LVUDFE", GridTypes.LOV)
        gridRequest.setRowCount(10)
		gridRequest.addParam("param.rentity", entity)
        gridRequest.addParam("control.org", '*')
        gridRequest.addFilter("userdefinedfieldvalue", filter, "BEGINS", "OR")
        gridRequest.addFilter("description", filter, "BEGINS")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    };

    getUDFCodeValues(options, config = {}) {
        let entity = options.handlerParams[0]
        let field = options.handlerParams[1]
        let gridRequest = new GridRequest("LVUDFC", GridTypes.LOV)
        gridRequest.addParam("param.field", field);
		gridRequest.addParam("param.fieldid", field);
		gridRequest.addParam("param.rentity", entity);
		gridRequest.addParam("param.associatedrentity", entity);
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    }

    getUDFCodeDescValues(options, config = {}) {
        let entity = options.handlerParams[0]
        let field = options.handlerParams[1]
        let gridRequest = new GridRequest("LVUDFCD", GridTypes.LOV)
        gridRequest.addParam("param.field", field);
		gridRequest.addParam("param.fieldid", field);
		gridRequest.addParam("param.rentity", entity);
		gridRequest.addParam("param.associatedrentity", entity);
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    }

}

export default new WSUDF();
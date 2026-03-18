import { getOrg } from '../hooks/tools';
import { GridFilterJoiner, GridRequest, GridType, transformResponse } from 'eam-rest-tools';
import { getGridData } from './WSGrids';

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
        const gridRequest = new GridRequest("LVUDFE", GridType.LOV)
            .setRowCount(10)
            .addParam("param.rentity", entity)
            .addParam("control.org", getOrg())
            .addFilter("userdefinedfieldvalue", filter, "BEGINS", GridFilterJoiner.OR)
            .addFilter("description", filter, "BEGINS")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    };

    getUDFCodeValues(options, config = {}) {
        let entity = options.handlerParams[0]
        let field = options.handlerParams[1]
        const gridRequest = new GridRequest("LVUDFC", GridType.LOV)
            .addParam("param.field", field)
            .addParam("param.fieldid", field)
            .addParam("param.rentity", entity)
            .addParam("param.associatedrentity", entity);
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    }

    getUDFCodeDescValues(options, config = {}) {
        let entity = options.handlerParams[0]
        let field = options.handlerParams[1]
        const gridRequest = new GridRequest("LVUDFCD", GridType.LOV)
            .addParam("param.field", field)
            .addParam("param.fieldid", field)
            .addParam("param.rentity", entity)
            .addParam("param.associatedrentity", entity);
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "userdefinedfieldvalue", desc: "description"}));
    }

}

export default new WSUDF();
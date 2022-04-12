// @flow
import ajax from "./AjaxGrid";

/**
 * Handles all calls to REST Api
 */
class GridWS {

    // Methods used in grid

    getGridData(gridRequest, config = {}) {
        return this._post('/grids/data/', gridRequest, config);
    }

    exportDataToCSV(gridRequest, config = {}) {
        return this._post('/grids/export/', gridRequest, config);
    }

    _get(url, config = {}) {
        return ajax.get(process.env.REACT_APP_BACKEND + url, config);
    }

    _post(url, data, config = {}) {
        return ajax.post(process.env.REACT_APP_BACKEND + url, data, config);
    }

    _put(url, data, config = {}) {
        return ajax.put(process.env.REACT_APP_BACKEND + url, data, config);
    }

    _delete(url, config = {}) {
        return ajax.delete(process.env.REACT_APP_BACKEND + url, config);
    }

}

export default new GridWS();
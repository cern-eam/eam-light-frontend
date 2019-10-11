import ajax from 'eam-components/dist/tools/ajax';

/**
 * Handles all calls to REST Api
 */
class TreeWS {

    // Methods used in Tree

    getEquipmentStructure(eqid, config = {timeout: 40000}) {
        return this._get(`/eqstructure/tree?eqid=${eqid}`, config);
    }

    _get(url, config = {}) {
        return ajax.get(window.environment.REACT_APP_BACKEND_URL + url, config);
    }

    _post(url, data, config = {}) {
        return ajax.post(window.environment.REACT_APP_BACKEND_URL + url, data, config);
    }

    _put(url, data, config = {}) {
        return ajax.put(window.environment.REACT_APP_BACKEND_URL + url, data, config);
    }

    _delete(url, config = {}) {
        return ajax.delete(window.environment.REACT_APP_BACKEND_URL + url, config);
    }

}

export default new TreeWS();
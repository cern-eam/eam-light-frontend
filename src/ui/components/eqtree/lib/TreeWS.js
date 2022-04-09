import ajax from 'eam-components/tools/ajax';

/**
 * Handles all calls to REST Api
 */
class TreeWS {

    // Methods used in Tree

    getEquipmentStructure(eqid, config = {timeout: 40000}) {
        return this._get(`/eqstructure/tree?eqid=${eqid}`, config);
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

export default new TreeWS();
import ajax from 'eam-components/dist/tools/ajax';

/**
 * Handles all calls to REST Api
 */
class TreeWS {

    // Methods used in Tree

    getEquipmentStructure(eqid, org, type, config = {timeout: 40000}) {
        return this._get(`/eqstructure/tree?eqid=${eqid}&org=${org}&type=${type}`, config);
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
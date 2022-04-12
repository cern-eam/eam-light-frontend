// @flow
import ajax from './ajax';

/**
 * Handles all calls to REST Api
 */
class WS {

    //
    //
    //
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

export default new WS();

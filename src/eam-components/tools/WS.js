import ajax from './ajax';

/**
 * Handles all calls to REST Api
 */
class WS {
    _get = (url, config = {}) => ajax.get(process.env.REACT_APP_BACKEND + url, config);
    _post = (url, data, config = {}) => ajax.post(process.env.REACT_APP_BACKEND + url, data, config);
    _put = (url, data, config = {}) => ajax.put(process.env.REACT_APP_BACKEND + url, data, config);
    _delete = (url, config = {}) => ajax.delete(process.env.REACT_APP_BACKEND + url, config);
}

export default new WS();

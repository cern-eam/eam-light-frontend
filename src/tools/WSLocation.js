import WS from './WS';

const init = (config = {}) => WS._get('/locations/init', config);

const get = (code, config = {}) => WS._get(`/locations/${encodeURIComponent(code)}`, config);

const create = (location, config = {}) => WS._post(`/locations/`, location, config);

const update = (location, config = {}) => WS._put(`/locations/${encodeURIComponent(location.code)}`, location, config)

const remove = (code, config = {}) => WS._delete(`/locations/${encodeURIComponent(code)}`);

export default {
    init,
    get,
    create,
    update,
    remove
}
import WS from './WS';

const init = (config = {}) => WS._get('/locations/init', config);

export const getLocation = (locationCode, organization, config = {}) => {
    return WS._get(`/locations/${encodeURIComponent(locationCode + '#' + organization)}`, config)
}

const create = (location, config = {}) => WS._post(`/locations/`, location, config);

export const updateLocation = (location, config = {}) => WS._put(`/locations`, location, config)

const remove = (code, config = {}) => WS._delete(`/locations/${code}`);

export default {
    init,
    create,
    remove
}


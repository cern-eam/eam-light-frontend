import { encodeCodeOrg } from '../hooks/tools';
import WS from './WS';

const init = (config = {}) => WS._get('/locations/init', config);

export const getLocation = (locationIdentifier, config = {}) => {
    return WS._get(`/locations/${encodeCodeOrg(locationIdentifier)}`, config)
}

const create = (location, config = {}) => WS._post(`/locations/`, location, config);

export const updateLocation = (location, config = {}) => WS._put(`/locations`, location, config)

const remove = (code, config = {}) => WS._delete(`/locations/${code}`);

export default {
    init,
    create,
    remove
}


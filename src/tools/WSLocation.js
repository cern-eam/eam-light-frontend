import WS from './WS';

const init = (config = {}) => WS._get('/locations/init', config);

const getLocation = (locationCode, organization, config = {}) => {
    return WS._get(`/locations/${encodeURIComponent(locationCode + '#' + organization)}`, config)
    .then(response => {
        return {
          ...response,
          body: {
            Result: response.body.data,
          }
        };
      });
}

const create = (location, config = {}) => WS._post(`/locations/`, location, config);

const update = (location, config = {}) => WS._put(`/locations/${location.code}`, location, config)

const remove = (code, config = {}) => WS._delete(`/locations/${code}`);



export default {
    init,
    getLocation,
    create,
    update,
    remove
}


import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSWatchers {

    //
    // WATCHERS Support
    //

    getWatchersForWorkOrder(woCode, config = {}) {
        return WS._get(`/workorders/${woCode}/watchers`, config);
    }

    addWatchersToWorkOrder(woCode, users, config = {}) {
        return WS._post(`/workorders/${woCode}/watchers`, users, config);
    }

    removeWatchersFromWorkOrder(woCode, users, config = {}) {
        return WS._put(`/workorders/${woCode}/watchers/remove`, users, config);
    }
}

export default new WSWatchers();
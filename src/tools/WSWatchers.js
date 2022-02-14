import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSWatchers {

    //
    // WATCHERS Support
    //

    getWatchersForWorkOrder(woCode, config = {}) {
        return WS._get(`/watchers/${woCode}`, config);
    }

    addWatchersToWorkOrder(woCode, users, config = {}) {
        return WS._put(`/watchers/${woCode}`, users, config);
    }

    removeWatchersFromWorkOrder(woCode, users, config = {}) {
        return WS._put(`/watchers/remove/${woCode}`, users, config);
    }

}

export default new WSWatchers();
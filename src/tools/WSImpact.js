import WS from './WS';

/**
 * Handles all calls to REST Api related with the impact integration
 */
class WSImpact {

    getLayoutInfo(facility, activityType, config = {}) {
        facility = encodeURIComponent(facility);
        activityType = encodeURIComponent(activityType);
        return WS._get(`/impact/layout/${facility}/${activityType}`, config);
    }

    getImpactActivity(activityId, config = {}) {
        activityId = encodeURIComponent(activityId);
        return WS._get(`/impact/activities/${activityId}`, config);
    }

    getWorkorderInfo(workorderNumber, config = {}) {
        workorderNumber = encodeURIComponent(workorderNumber);
        return WS._get(`/impact/workorders/${workorderNumber}`, config);
    }

    getWorkorderInfosWithSameActivity(activityId, config = {}) {
        activityId = encodeURIComponent(activityId);
        return WS._get(`/impact/workorderswithactivity/${activityId}`, config);
    }

    getImpactFacilities(locationCode, config = {}) {
        locationCode = encodeURIComponent(locationCode);
        return WS._get(`/impact/location/facilities?locationCode=${locationCode}`, config);
    }

    createImpactActivity(impactActivity, config = {}) {
        return WS._post('/impact/', impactActivity, config);
    }

    linkWorkorderToImpactActivity(workordernum, activityid, config = {}) {
        return WS._post(`/impact/workorders/${workordernum}/activities/${activityid}`, config);
    }

    linkWorkordersToImpactActivity(impactActivity, workorders, config = {}) {
        return WS._put(`/impact/activities/${impactActivity}`, workorders);
    }

    unlinkWorkorder(workorder, config = {}) {
        return WS._delete(`/impact/workorders/${workorder}/activity`);
    }
}

export default new WSImpact();
import ajax from 'eam-components/tools/ajax';

/**
 * Handles all calls to REST Api related with the impact integration
 */
class WSImpact {

    getData(config = {}) {
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/data`, config);
    }

    getLayoutInfo(facility, activityType, config = {}) {
        facility = encodeURIComponent(facility);
        activityType = encodeURIComponent(activityType);
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/layout/${facility}/${activityType}`, config);
    }

    getImpactActivity(activityId, config = {}) {
        activityId = encodeURIComponent(activityId);
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/activities/${activityId}`, config);
    }

    getWorkorderInfo(workorderNumber, config = {}) {
        workorderNumber = encodeURIComponent(workorderNumber);
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/workorders/${workorderNumber}`, config);
    }

    getWorkorderInfosWithSameActivity(activityId, config = {}) {
        activityId = encodeURIComponent(activityId);
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/workorderswithactivity/${activityId}`, config);
    }

    getImpactFacilities(locationCode, config = {}) {
        locationCode = encodeURIComponent(locationCode);
        return ajax.get(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/location/facilities?locationCode=${locationCode}`, config);
    }

    createImpactActivity(impactActivity, config = {}) {
        return ajax.post(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + '/impact/', impactActivity, config);
    }

    linkWorkorderToImpactActivity(workordernum, activityid, config = {}) {
        return ajax.post(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/workorders/${workordernum}/activities/${activityid}`, config);
    }

    linkWorkordersToImpactActivity(impactActivity, workorders, config = {}) {
        return ajax.put(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/activities/${impactActivity}`, workorders);
    }

    unlinkWorkorder(workorder, config = {}) {
        return ajax.delete(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest') + `/impact/workorders/${workorder}/activity`);
    }
}

export default new WSImpact();
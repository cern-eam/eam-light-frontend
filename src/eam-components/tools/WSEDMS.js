import ajax from './ajax';

/**
 * Handles all calls to REST Api
 */
class WSEDMS {

    //
    //EDMS
    //
    getEDMSDocuments(objectID, objectType, mode, config = {}) {
        objectType = encodeURIComponent(objectType);
        return ajax.get(process.env.REACT_APP_BACKEND
            .replace('/logbookws/rest', '/cern-eam-services/rest')
            .replace('/eamlightws/rest', '/cern-eam-services/rest')
             + `/edms/documents?objectid=${objectID}&objectType=${objectType}&mode=${mode}`, config);
    }

    createNewDocument(data, config = {}) {
        return ajax.post(process.env.REACT_APP_BACKEND
            .replace('/logbookws/rest', '/cern-eam-services/rest')
            .replace('/eamlightws/rest', '/cern-eam-services/rest') + `/edms/createdocument`, data, config);
    }

    getNCRProperties(objectType, objectID, config = {}) {
        return ajax.get(process.env.REACT_APP_BACKEND
            .replace('/logbookws/rest', '/cern-eam-services/rest')
            .replace('/eamlightws/rest', '/cern-eam-services/rest') + `/edms/ncrproperties`, config);
    }

    getNCRKeyWords(objectID, config = {}) {
        return ajax.get(process.env.REACT_APP_BACKEND
            .replace('/logbookws/rest', '/cern-eam-services/rest')
            .replace('/eamlightws/rest', '/cern-eam-services/rest') + `/edms/ncrkeywords/${objectID}`, config);
    }

    getEquipmentWorkOrders(objectType, objectID, config = {}) {
        return ajax.get(process.env.REACT_APP_BACKEND
            .replace('/logbookws/rest', '/cern-eam-services/rest')
            .replace('/eamlightws/rest', '/cern-eam-services/rest') + `/edms/equipmentwos?objectType=${objectType}&objectCode=${objectID}`, config);
    }
}

export default new WSEDMS();
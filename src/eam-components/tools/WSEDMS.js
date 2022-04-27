import WS from './WS';

const eamServicesPath = process.env.REACT_APP_BACKEND
    .replace('/logbookws/rest', '/cern-eam-services/rest')
    .replace('/eamlightws/rest', '/cern-eam-services/rest')
/**
 * Handles all calls to REST Api
 */
class WSEDMS {
    getEDMSDocuments = (objectID, objectType, mode, config = {}) =>
        WS._get(`${eamServicesPath}/edms/documents?objectid=${objectID}&objectType=${objectType}&mode=${mode}`, config);

    getEquipmentWorkOrders = (objectType, objectID, config = {}) => 
        WS._get(`${eamServicesPath}/edms/equipmentwos?objectType=${objectType}&objectCode=${objectID}`, config);

    createNewDocument = (data, config = {}) => WS._post(`${eamServicesPath}/edms/createdocument`, data, config);

    getNCRProperties = (config = {}) => WS._get(`${eamServicesPath}/edms/ncrproperties`, config);
    
    getNCRKeyWords = (objectID, config = {}) => WS._get(`${eamServicesPath}/edms/ncrkeywords/${objectID}`, config);
}

export default new WSEDMS();
import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSChecklists {

    getWorkOrderActivities = (number, config = { timeout: 60000 }) => WS._get('/activities/read/?workorder=' + number, config);
    
    updateChecklistItem = (checklistItem, config = {}) => WS._put('/checklists/', checklistItem, config);
    
    createFollowUpWorkOrders = (activity, config = {}) => WS._post('/checklists/workorders', activity, config);

    esignChecklist = (checklistSignature, config = {}) => WS._put('/checklists/esign', checklistSignature, config);
    
    getChecklistDefinition = (taskCode, checklistDefinitionCode, config = {}) => 
        WS._get(`/checklists/definition/${taskCode}/${checklistDefinitionCode}`, config);
}

export default new WSChecklists();
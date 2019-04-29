import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSEquipment {

    //
    // EQUIPMENT
    //
    getEquipmentHistory(equipmentCode, config = {}) {
        return WS._get('/equipment/history?c=' + equipmentCode, config);
    }

    getEquipmentWorkOrders(equipmentCode, config = {}) {
        return WS._get('/equipment/workorders?c=' + equipmentCode, config);
    }

    getEquipment(equipmentCode, config = {}) {
        equipmentCode = encodeURIComponent(equipmentCode);
        return WS._get('/equipment?c=' + equipmentCode, config);
    }

    updateEquipment(equipment, config = {}) {
        return WS._put('/equipment/', equipment, config);
    }

    createEquipment(equipment, config = {}) {
        return WS._post('/equipment/', equipment, config);
    }

    deleteEquipment(equipment, config = {}) {
        return WS._delete('/equipment/' + equipment, config);
    }

    initEquipment(entity, eqpType, systemFunction, userFunction, params, config = {}) {
        return WS._get(`/equipment/init/${entity}/${eqpType}/${systemFunction}/${userFunction}${params}`, config);
    }

    getEquipmentStatusValues(neweqp, oldStatusCode, config = {}) {
        return WS._get(`/eqplists/statuscodes?neweqp=${neweqp}&oldStatusCode=${oldStatusCode}`, config);
    }

    getEquipmentCriticalityValues(config = {}) {
        return WS._get('/eqplists/criticalitycodes', config);
    }

    autocompleteManufacturer(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/eqp/manufacturer/' + filter, config);
    }

    autocompleteEquipmentPart(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/eqp/part/' + filter, config);
    }

    autocompleteEquipmentStore(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/eqp/store/' + filter, config);
    }

    autocompleteEquipmentBin(store, filter, config = {}) {
        return WS._get(`/autocomplete/eqp/bin?code=${filter}&store=${store}`, config);
    }

    autocompleteEquipmentCategory(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/category/${filter}`, config);
    }

    autocompleteEquipmentDepartment(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/department/${filter}`, config);
    }

    autocompleteEquipmentParent(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/parent/${filter}`, config);
    }

    autocompleteEquipmentPosition(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/position/${filter}`, config);
    }

    autocompleteLocation = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/location/?code=${filter}`, config);
    };

    autocompletePrimarySystem(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/primsystem/${filter}`, config);
    }

    getEquipmentPartsAssociated(equipment, parentScreen, config = {}) {
        equipment = encodeURIComponent(equipment);
        return WS._get(`/equipment/partsassociated/${parentScreen}/${equipment}`, config);
    }

    getCategoryData(categoryCode, config = {}) {
        return WS._get(`/autocomplete/eqp/categorydata/${categoryCode}`, config);
    }

    //
    //EQUIPMENT REPLACEMENT
    //
    autocompleteEquipmentReplacement = (code, config = {}) => {
        code = encodeURIComponent(code);
        return WS._get(`/autocomplete/eqp/eqpreplace/${code}`, config);
    };

    replaceEquipment(equipmentRpl, config = {}) {
        return WS._post('/equipment/replace', equipmentRpl, config);
    }

    getEquipmentChildren(equipment, config = {}) {
        equipment = encodeURIComponent(equipment);
        return WS._get(`/equipment/children/${equipment}`, config);
    }
}

export default new WSEquipment();
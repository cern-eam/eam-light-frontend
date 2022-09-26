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

    getEquipmentEvents(equipmentCode, equipmentType, config = {}) {
        return WS._get(`/equipment/events?c=${equipmentCode}&t=${equipmentType}`, config);
    }

    getEquipment(equipmentCode, config = {}) {
        equipmentCode = encodeURIComponent(equipmentCode.replace('%23', '#'));
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

    getEquipmentType(equipmentCode, config = {}) {
        return WS._get('/equipment/type', { ...config, params: { c: equipmentCode }});
    }

    initEquipment(eqpType, config = {}) {
        return WS._get(`/equipment/init/${eqpType}`, config);
    }

    getEquipmentStatusValues(userGroup, neweqp, oldStatusCode, config = {}) {
        return WS._get(`/eqplists/statuscodes?userGroup=${encodeURIComponent(userGroup)}&neweqp=${neweqp}&oldStatusCode=${oldStatusCode}`, config);
    }

    getEquipmentCriticalityValues(config = {}) {
        return WS._get('/eqplists/criticalitycodes', config);
    }

    getEquipmentStateValues(config = {}) {
        return WS._get('/eqplists/statecodes', config);
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

    autocompleteEquipmentCategory(eqpClass, filter, config = {}) {
        filter = encodeURIComponent(filter);
        eqpClass = eqpClass === null ? '' : eqpClass;
        return WS._get(`/autocomplete/eqp/category/${filter}`, {
            ...config,
            params: {
                class: eqpClass,
                ...config.params
            }
        });
    }

    autocompleteEquipmentDepartment(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/department/${filter}`, config);
    }
    autocompleteCostCode = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/equipment/costcode/' + filter, config);
    };

    //
    // HIERARCHY
    //
    autocompleteAssetParent(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/parent/A?code=${filter}`, config);
    }

    autocompletePositionParent(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/parent/P?code=${filter}`, config);
    }

    autocompletePrimarySystemParent(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/parent/S?code=${filter}`, config);
    }

    autocompleteLocation = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/eqp/location/?s=${filter}`, config);
    };

    //
    //
    //

    getEquipmentPartsAssociated(equipment, parentScreen, config = {}) {
        equipment = encodeURIComponent(equipment);
        return WS._get(`/equipment/partsassociated/${parentScreen}/${equipment}`, config);
    }

    getCategory(categoryCode, config = {}) {
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

    //
    //INSTALL EQUIPMENT
    //
    installEquipment(equipmentStructure, config = {}) {
        return WS._post('/eqstructure/attach', equipmentStructure, config);
    }
}

export default new WSEquipment();
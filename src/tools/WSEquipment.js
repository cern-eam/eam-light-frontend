import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';
import WSWorkorders from './WSWorkorders';

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

    getEquipmentWorkOrders(equipmentCode) {
        let gridRequest = new GridRequest("WSJOBS", GridTypes.LIST)
        gridRequest.rowCount = 2000
        gridRequest.addFilter("equipment", equipmentCode, "=")
        gridRequest.sortBy("datecreated", "DESC")
        return getGridData(gridRequest).then(response => transformResponse(response, WSWorkorders.myWorkOrderMapper));
    }

    getSparePart(originalEquipment) {
       let gridRequest = new GridRequest("OSOBJA", GridTypes.LIST); //we only display 100 records per default
        if(!originalEquipment.partCode) {
            return;
        }
        gridRequest.addFilter("equipmentno", originalEquipment.code, "!=");
        gridRequest.addFilter("part", originalEquipment.partCode, "=");
        gridRequest.addFilter("statusrcode", 'C', "!=");
        gridRequest.addFilter("position", '', "IS EMPTY");
        gridRequest.addFilter("parentasset", '', "IS EMPTY");
        gridRequest.addFilter("outofservice", '-', "NOT_SELECTED");

        return getGridData(gridRequest).then(response => response.body.data);
    }

    getEquipmentEvents(equipmentCode, equipmentType, config = {}) {
        return WS._get(`/equipment/events?c=${equipmentCode}&t=${equipmentType}`, config);
    }

    getEquipment(equipmentCode, config = {}) {
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

    collectDetachableEquipment(oldEquipment, config = {}) {
        oldEquipment = encodeURIComponent(oldEquipment);
        return WS._get(`/equipment/collectdetachables/${oldEquipment}`, config);
    }

    getEquipmentChildren(equipment, config = {}) {
        equipment = encodeURIComponent(equipment);
        return WS._get(`/equipment/children/${equipment}`, config);
    }

    //
    //EQUIPMENT STRUCTURE
    //
    installEquipment(equipmentStructure, config = {}) {
        return WS._post('/eqstructure/attach', equipmentStructure, config);
    }

    detachEquipment(equipmentStructure, config = {}) {
        return WS._post('/eqstructure/detach', equipmentStructure, config);
    }
}

export default new WSEquipment();
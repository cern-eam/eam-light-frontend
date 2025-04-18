import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getAsset } from './WSAssets';
import { getGridData, transformResponse } from './WSGrids';
import { getPosition } from './WSPositions';
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
        gridRequest.addFilter("equipment", equipmentCode, "=")
        gridRequest.sortBy("datecreated", "DESC")
        return getGridData(gridRequest).then(response => transformResponse(response, WSWorkorders.myWorkOrderMapper));
    }

    getEquipmentEvents(equipmentCode, equipmentType, config = {}) {
        return WS._get(`/equipment/events?c=${equipmentCode}&t=${equipmentType}`, config);
    }

    async getEquipment(equipmentCode, organization, config = {}) {
        const equipmentType = await this.getEquipmentType(equipmentCode, organization);
        
        const codeorg = encodeURIComponent(equipmentCode + '#' + organization)

        switch(equipmentType) {
            case "A":
                return WS._get(`/proxy/assets/${codeorg}`, config)
            case "P":
                return WS._get(`/proxy/positions/${codeorg}`, config)
        }
    }

    getEquipmentType(equipmentCode, organization, config = {}) {
        console.log('eqp', equipmentCode, organization)
        let gridRequest = new GridRequest("OCOBJC", GridTypes.LIST)
        gridRequest.addFilter("obj_code", equipmentCode, "=", "AND");
        gridRequest.addFilter("obj_org", organization, "=");
        gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
        return getGridData(gridRequest).then(response => response.body.data[0]?.obj_obrtype)
    }

    autocompleteEquipmentStore(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/eqp/store/' + filter, config);
    }

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

export const getEquipment = async (equipmentCode, organization, config = {}) => {
    const equipmentType = await getEquipmentType(equipmentCode, organization);

    switch(equipmentType) {
        case "A":
            return getAsset(equipmentCode, organization, config)
        case "P":
            return getPosition(equipmentCode, organization, config)
    }
}

export const getEquipmentType = async (equipmentCode, organization, config = {}) => {
    let gridRequest = new GridRequest("OCOBJC", GridTypes.LIST)
    gridRequest.addFilter("obj_code", equipmentCode, "=", "AND");
    gridRequest.addFilter("obj_org", organization, "=");
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    return getGridData(gridRequest).then(response => response.body.data[0]?.obj_obrtype)
}

export default new WSEquipment();
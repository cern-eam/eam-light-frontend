import GridRequest, { GridFilterJoiner, GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getAsset } from './WSAssets';
import { getGridData, transformResponse } from './WSGrids';
import { getPosition } from './WSPositions';
import { getSystem } from './WSSystems';
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

    autocompleteEquipmentStore(filter, config = {}) {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/eqp/store/' + filter, config);
    }

    //
    // HIERARCHY
    //
    autocompleteAssetParent({handlerParams, filter, operator = "BEGINS"}, config = {}) {
        let gridRequest = new GridRequest( "LVOBJL_EQ")
        gridRequest.setRowCount(10)
        gridRequest.addParam("param.objectrtype", handlerParams[0])
        gridRequest.addParam("param.bypassdeptsecurity", null)
        gridRequest.addParam("param.objectcode", "")
        gridRequest.addParam("param.objectorg", "*")
        gridRequest.addParam("control.org", "*")
        gridRequest.addFilter("equipmentcode", filter, operator)
        gridRequest.sortBy("equipmentcode")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "equipmentcode", desc: "description_obj", org: "equiporganization"}));
    }

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
        case "S":
            return getSystem(equipmentCode, organization, config)
    }
}

export const getEquipmentType = async (equipmentCode, organization = '*', config = {}) => {
    let gridRequest = new GridRequest("OCOBJC", GridTypes.LIST)
    gridRequest.addFilter("obj_code", equipmentCode, "=", "AND");
    gridRequest.addFilter("obj_org", organization, "=");
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    let equipmentType = await getGridData(gridRequest).then(response => response.body.data[0]?.obj_obrtype)

    if (equipmentType) {
        return equipmentType
    }

    let gridRequestLocation = new GridRequest("OSOBJL", GridTypes.LIST);
    gridRequestLocation.addFilter("equipmentno", equipmentCode, "=", GridFilterJoiner.AND);
    gridRequestLocation.addFilter("organization", organization, "=");
    let gridRequestLocationResponse = await getGridData(gridRequestLocation).then(response => response.body.data)
    console.log("kura", gridRequestLocationResponse)
    if (gridRequestLocationResponse.length == 1) {
        return "L"
    }

    return null;
}

export const getEquipmentDocuments = async (code, organization, config = {}) => {
    let gridRequest = new GridRequest("BCDOCOBJ_IPAD", GridTypes.LIST)
    gridRequest.addParam("parameter.code1", code)
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    return getGridData(gridRequest)
}

export const getWorkOrderDocuments = async (code, organization = '*', config = {}) => {
    let gridRequest = new GridRequest("BCDOCWO_IPAD", GridTypes.LIST)
    //gridRequest.addParam("parameter.code1", code)
    
    gridRequest.addFilter("doc_entitycode", code, "=");
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    return getGridData(gridRequest)
}

export default new WSEquipment();
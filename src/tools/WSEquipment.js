import { getOrg } from '../hooks/tools';
import GridRequest, { GridFilterJoiner, GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getAsset } from './WSAssets';
import { getGridData, transformResponse } from './WSGrids';
import { getLocation } from './WSLocation';
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
        let gridRequest = new GridRequest("EUMLWH", GridTypes.LIST);
        gridRequest.addFilter("woobject", equipmentCode, "=");
        gridRequest.sortBy("wocompleted", "DESC");

        const fieldMapping = {
            number: "wocode",
            desc: "wotypedescription",
            object: "woobject",
            relatedObject: "relatedobject",
            completedDate: "wocompleted",
            enteredBy: "woenteredby",
            type: "wotype",
            jobType: "wojobtype"
          };

        return getGridData(gridRequest).then(response => transformResponse(response, fieldMapping));
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
        gridRequest.addParam("param.objectorg", getOrg())
        gridRequest.addParam("control.org", getOrg())
        gridRequest.addParam('param.bypasstagoption', 'true')
        gridRequest.addFilter("equipmentcode", filter, operator)
        gridRequest.sortBy("equipmentcode")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "equipmentcode", desc: "description_obj", org: "equiporganization"}));
    }

    autocompletePartsAssociated({filter}, config = {}) {
        let gridRequest = new GridRequest( "SSPART")
        gridRequest.addFilter('partcode', filter, "BEGINS")
        gridRequest.setRowCount(10)
        gridRequest.sortBy("partcode")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "partcode", desc: "description", org: "organization", uom: "uom"}));
    }

    getEquipmentPartsAssociated(code, associationEntity, config = {}) {
        let gridRequest = new GridRequest("BSPARA");

        gridRequest.addParam("param.entity", associationEntity);
        gridRequest.addParam("param.valuecode", code);

        return getGridData(gridRequest, config)
    }

    getCategory(categoryCode, config = {}) {
        return WS._get(`/proxy/category/${categoryCode}`, config);
    }

    createPartAssociated(part, config = {}) {
        return WS._post('/equipment/partsassociated', part, config);
    }

    //
    //EQUIPMENT REPLACEMENT
    //
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

export const getEquipment = async (equipmentCode, organization = getOrg(), config = {}) => {
    const equipmentType = await getEquipmentType(equipmentCode, organization);
  
    const extract = (response) => response.body.Result.ResultData;
  
    switch (equipmentType) {
      case "A":
        return extract(await getAsset(equipmentCode, organization, config)).AssetEquipment;
      case "P":
        return extract(await getPosition(equipmentCode, organization, config)).PositionEquipment;
      case "S":
        return extract(await getSystem(equipmentCode, organization, config)).SystemEquipment;
      case "L":
        return extract(await getLocation(equipmentCode, organization, config)).Location;
      default:
        return null;
    }
  };
  

export const getEquipmentType = async (equipmentCode, organization, config = {}) => {
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
    if (gridRequestLocationResponse.length == 1) {
        return "L"
    }

    return null;
}

export default new WSEquipment();
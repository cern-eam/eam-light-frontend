import { encodeCodeOrg, getCodeOrg, getOrg } from '../hooks/tools';
import { GridFilterJoiner, GridRequest, GridType, transformResponse } from 'eam-rest-tools';
import WS from './WS';
import { getAsset } from './WSAssets';
import { getGridData } from './WSGrids';
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
        const gridRequest = new GridRequest("EUMLWH", GridType.LIST)
            .addFilter("woobject", equipmentCode, "=")
            .sortBy("wocompleted", "DESC");

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
        const gridRequest = new GridRequest("WSJOBS", GridType.LIST, "WSJOBS")
            .addFilter("equipment", equipmentCode, "=")
            .sortBy("datecreated", "DESC")
        return getGridData(gridRequest).then(response => transformResponse(response, WSWorkorders.myWorkOrderMapper));
    }

    getEquipmentEvents(equipmentCode, equipmentOrg, screenCode, config = {}) {
        const gridRequest = new GridRequest("OSVEVT", GridType.LIST, screenCode)
            .addParam("parameter.object", equipmentCode)
            .addParam("parameter.objorganization", equipmentOrg)
            .addFilter("wotype", "IS - ", "NOTCONTAINS")
            .addFilter("equipment", equipmentCode, "=")
            .sortBy("datecreated", "DESC")

        const equipmentEventsMapper = {
            "number": "eventno",
            "desc": "description",
            "status": "statusdisplay",
            "statusCode": null,
            "jobType": "wotype",
            "object": "equipment",
            "mrc": "organization",
            "type": "eventtype",
            "priority": null,
            "schedulingEndDate": "schedenddate",
            "schedulingStartDate": "schedstartdate",
            "createdDate": "datecreated",
            "completedDate": "completiondate",
            "equipmentType": null
            }

        return getGridData(gridRequest).then(response => transformResponse(response, equipmentEventsMapper));
    }

    //
    // HIERARCHY
    //
    autocompleteAssetParent({handlerParams, filter, operator = "BEGINS"}, config = {}) {
        const gridRequest = new GridRequest("LVOBJL_EQ")
            .setRowCount(10)
            .addParam("param.objectrtype", handlerParams[0])
            .addParam("param.bypassdeptsecurity", null)
            .addParam("param.objectcode", "")
            .addParam("param.objectorg", getOrg())
            .addParam("control.org", getOrg())
            .addParam('param.bypasstagoption', 'true')
            .addFilter("equipmentcode", filter, operator)
            .sortBy("equipmentcode")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "equipmentcode", desc: "description_obj", org: "equiporganization"}));
    }

    autocompletePartsAssociated({filter, operator  = "BEGINS"}, config = {}) {
        const gridRequest = new GridRequest( "SSPART")
        .addFilter('partcode', filter, operator, GridFilterJoiner.AND)
        .addFilter('outofservice', "0", "=")
        .setRowCount(10)
        .sortBy("partcode")
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "partcode", desc: "description", org: "organization", uom: "uom"}));
    }

    getEquipmentPartsAssociated(code, associationEntity, config = {}) {
        const gridRequest = new GridRequest("BSPARA")
            .addParam("param.entity", associationEntity)
            .addParam("param.valuecode", code);

        return getGridData(gridRequest, config)
    }

    getCategory(categoryCode, config = {}) {
        return WS._get(`/proxy/category/${categoryCode}`, config);
    }

    createPartAssociated(part, config = {}) {
        return WS._post('/equipment/partsassociated', part, config);
    }

    deletePartAssociated(equipmentCode, pk, config = {}) {
        return WS._delete(`/proxy/assets/${encodeCodeOrg(equipmentCode)}/partsassociated/${pk}`, config);
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

export const getEquipment = async (equipmentIdentifier, config = {}) => {
    const equipmentType = await getEquipmentType(equipmentIdentifier);

    const extract = (response) => response.body.Result.ResultData;

    switch (equipmentType) {
      case "A":
        return extract(await getAsset(equipmentIdentifier, config)).AssetEquipment;
      case "P":
        return extract(await getPosition(equipmentIdentifier, config)).PositionEquipment;
      case "S":
        return extract(await getSystem(equipmentIdentifier, config)).SystemEquipment;
      case "L":
        return extract(await getLocation(equipmentIdentifier, config)).Location;
      default:
        return null;
    }
  };


export const getEquipmentType = async (equipmentIdentifier, config = {}) => {
    const {code: equipmentCode, org: organization} = getCodeOrg(equipmentIdentifier)
    const gridRequest = new GridRequest("OCOBJC", GridType.LIST)
        .addFilter("obj_code", equipmentCode, "=", GridFilterJoiner.AND)
        .addFilter("obj_org", organization, "=")
        .addParam("parameter.lastupdated", "31-JAN-1970");
    let equipmentType = await getGridData(gridRequest).then(response => response.body.data[0]?.obj_obrtype)

    if (equipmentType) {
        return equipmentType
    }

    const gridRequestLocation = new GridRequest("OSOBJL", GridType.LIST)
        .addFilter("equipmentno", equipmentCode, "=", GridFilterJoiner.AND)
        .addFilter("organization", organization, "=");
    const gridRequestLocationResponse = await getGridData(gridRequestLocation).then(response => response.body.data)
    if (gridRequestLocationResponse.length == 1) {
        return "L"
    }

    return null;
}

export default new WSEquipment();
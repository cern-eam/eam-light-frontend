import { encodeCodeOrg, getCodeOrg, getOrg } from '../hooks/tools';
import WS from './WS';

export const createSystem = (position, config = {}) => {
  return WS._post(`/proxy/systems`, position, config)
}

export const updateSystem = (position, config = {}) => {
  return WS._put(`/proxy/systems`, position, config)
}

export const getSystem = async (equipmentIdentifier, config = {}) => {
    const {code: systemCode, org: organization} = getCodeOrg(equipmentIdentifier)
    const positionResponse = await WS._get(`/proxy/systems/${encodeCodeOrg(equipmentIdentifier)}`, config)
    const hierarchyResponse = await getSystemHierarchy(systemCode, organization, config);
    positionResponse.body.Result.ResultData.SystemEquipment.SystemParentHierarchy = hierarchyResponse.body.Result.ResultData.SystemParentHierarchy;
    return positionResponse;
}

export const getSystemHierarchy = async (equipmentCode, organization, config = {}) => {
    const request = {
        "SYSTEMID": {
          "EQUIPMENTCODE": equipmentCode,
          "ORGANIZATIONID": {
            "ORGANIZATIONCODE": organization
          }
        }
      }
    return WS._post(`/proxy/systemparenthierarchy`, request, config)
}

export const deleteSystem = (equipmentIdentifier, config = {}) => {
  return WS._delete(`/proxy/systems/${encodeCodeOrg(equipmentIdentifier)}`, config)
}

export const getSystemDefault = (organization = getOrg(), config = {}) => {
  return WS._post(`/proxy/systemdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
  .then(response => {
    if (response.body.Result.ResultData.AssetEquipment) { // For the moment the REST WS returns wrong response that needs to be altered 
      response.body.Result.ResultData.SystemEquipmentDefault = response.body.Result.ResultData.AssetEquipment
      delete response.body.Result.ResultData.AssetEquipment
      response.body.Result.ResultData.SystemEquipmentDefault.ORGANIZATIONID = response.body.Result.ResultData.SystemEquipmentDefault.ASSETID.ORGANIZATIONID
      delete response.body.Result.ResultData.SystemEquipmentDefault.ASSETID
      response.body.Result.ResultData.SystemEquipmentDefault.TYPE.TYPECODE = 'S'
    }

    response.body.Result.ResultData.SystemEquipmentDefault.SYSTEMID = {}
    response.body.Result.ResultData.SystemEquipmentDefault.SYSTEMID.ORGANIZATIONID = response.body.Result.ResultData.SystemEquipmentDefault.ORGANIZATIONID
    response.body.Result.ResultData.SystemEquipmentDefault.SystemParentHierarchy = {}
    return response
  })
}
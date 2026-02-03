import { encodeCodeOrg, getCodeOrg, getOrg } from '../hooks/tools';
import WS from './WS';

export const createPosition = (position, config = {}) => {
  return WS._post(`/proxy/positions`, position, config)
}

export const updatePosition = (position, config = {}) => {
  return WS._put(`/proxy/positions`, position, config)
}

export const getPosition = async (equipmentIdentifier, config = {}) => {
    const {code: positionCode, org: organization} = getCodeOrg(equipmentIdentifier)
    const positionResponse = await WS._get(`/proxy/positions/${encodeURIComponent(positionCode + '#' + organization)}`, config)
    const hierarchyResponse = await getPositionHierarchy(positionCode, organization, config);
    positionResponse.body.Result.ResultData.PositionEquipment.PositionParentHierarchy = hierarchyResponse.body.Result.ResultData.PositionParentHierarchy; 
    return positionResponse;
}

    // TODO still using SOAP as the REST doesn't work correctly
export const getPositionHierarchy = async (equipmentCode, organization, config = {}) => {
    // const request = {
    //     "POSITIONID": {
    //       "EQUIPMENTCODE": equipmentCode,
    //       "ORGANIZATIONID": {
    //         "ORGANIZATIONCODE": organization
    //       }
    //     }
    //   }
    // return WS._post(`/proxy/positionparenthierarchy`, request, config)

    return WS._get(`/proxy/positionparenthierarchy?code=${equipmentCode}&org=${organization}`, config)

}

export const deletePosition = (equipmentIdentifier, config = {}) => {
  return WS._delete(`/proxy/positions/${encodeCodeOrg(equipmentIdentifier)}`, config)
}

export const getPositionsDefault = (organization = getOrg(), config = {}) => {
  return WS._post(`/proxy/positiondefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
  .then(response => {
    if (response.body.Result.ResultData.AssetEquipment) { // For the moment the REST WS returns wrong response that needs to be altered 
      response.body.Result.ResultData.PositionEquipmentDefault = response.body.Result.ResultData.AssetEquipment
      delete response.body.Result.ResultData.AssetEquipment
      response.body.Result.ResultData.PositionEquipmentDefault.ORGANIZATIONID = response.body.Result.ResultData.PositionEquipmentDefault.ASSETID.ORGANIZATIONID
      delete response.body.Result.ResultData.PositionEquipmentDefault.ASSETID
      response.body.Result.ResultData.PositionEquipmentDefault.TYPE.TYPECODE = 'P'
    }
    
    response.body.Result.ResultData.PositionEquipmentDefault.POSITIONID = {}
    response.body.Result.ResultData.PositionEquipmentDefault.POSITIONID.ORGANIZATIONID = response.body.Result.ResultData.PositionEquipmentDefault.ORGANIZATIONID
    response.body.Result.ResultData.PositionEquipmentDefault.PositionParentHierarchy = {}
    return response
  })
}
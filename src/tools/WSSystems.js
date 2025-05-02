import WS from './WS';

export const createSystem = (position, config = {}) => {
  return WS._post(`/proxy/systems`, position, config)
}

export const updateSystem = (position, config = {}) => {
  return WS._put(`/proxy/systems`, position, config)
}

export const getSystem = async (positionCode, organization, config = {}) => {
    const positionResponse = await WS._get(`/proxy/systems/${encodeURIComponent(positionCode + '#' + organization)}`, config)
    const hierarchyResponse = await getSystemHierarchy(positionCode, organization, config);
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

export const deleteSystem = (positionCode, organization, config = {}) => {
  return WS._delete(`/proxy/systems/${encodeURIComponent(positionCode + '#' + organization)}`, config)
}

export const getSystemDefault = (organization = '*', config = {}) => {
  console.log("sys default")
  return WS._post(`/proxy/systemdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
  .then(response => {
    if (response.body.Result.ResultData.AssetEquipment) { // For the moment the REST WS returns wrong response that needs to be altered 
      response.body.Result.ResultData.SystemEquipment = response.body.Result.ResultData.AssetEquipment
      delete response.body.Result.ResultData.AssetEquipment
      response.body.Result.ResultData.SystemEquipment.SYSTEMID = response.body.Result.ResultData.SystemEquipment.ASSETID
      delete response.body.Result.ResultData.SystemEquipment.ASSETID
      response.body.Result.ResultData.SystemEquipment.TYPE.TYPECODE = 'S'
    }
    response.body.Result.ResultData.SystemEquipment.SYSTEMID.EQUIPMENTCODE = null;
    return response
  })
}
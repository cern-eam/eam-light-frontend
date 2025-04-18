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
  return WS._post(`/proxy/systemdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
}
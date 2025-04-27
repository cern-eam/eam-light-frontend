import WS from './WS';

export const createPosition = (position, config = {}) => {
  return WS._post(`/proxy/positions`, position, config)
}

export const updatePosition = (position, config = {}) => {
  return WS._put(`/proxy/positions`, position, config)
}

export const getPosition = async (positionCode, organization, config = {}) => {
    const positionResponse = await WS._get(`/proxy/positions/${encodeURIComponent(positionCode + '#' + organization)}`, config)
    const hierarchyResponse = await getPositionHierarchy(positionCode, organization, config);
    // TODO still using SOAP
    positionResponse.body.Result.ResultData.PositionEquipment.PositionParentHierarchy = hierarchyResponse.body.Result.ResultData.PositionParentHierarchy; 
    return positionResponse;
}

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

export const deletePosition = (positionCode, organization, config = {}) => {
  return WS._delete(`/proxy/positions/${encodeURIComponent(positionCode + '#' + organization)}`, config)
}

export const getPositionsDefault = (organization = '*', config = {}) => {
  return WS._post(`/proxy/positiondefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
}
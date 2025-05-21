import { getOrg } from '../hooks/tools';
import WS from './WS';

export const createAsset = (asset, config = {}) => {
  return WS._post(`/proxy/assets`, asset, config)
}

export const updateAsset = (asset, config = {}) => {
  return WS._put(`/proxy/assets`, asset, config)
}

export const getAsset = async (assetCode, organization, config = {}) => {
    const assetResponse = await WS._get(`/proxy/assets/${encodeURIComponent(assetCode + '#' + organization)}`, config)
    const hierarchyResponse = await getAssetHierarchy(assetCode, organization, config);
    assetResponse.body.Result.ResultData.AssetEquipment.AssetParentHierarchy = hierarchyResponse.body.Result.ResultData.AssetParentHierarchy;
    return assetResponse;
}

export const getAssetHierarchy = async (equipmentCode, organization, config = {}) => {
    const request = {
        "ASSETID": {
          "EQUIPMENTCODE": equipmentCode,
          "ORGANIZATIONID": {
            "ORGANIZATIONCODE": organization
          }
        }
      }
    return WS._post(`/proxy/assetparenthierarchy`, request, config)
}

export const deleteAsset = (assetCode, organization, config = {}) => {
  return WS._delete(`/proxy/assets/${encodeURIComponent(assetCode + '#' + organization)}`, config)
}

export const getAssetDefault = (organization = getOrg(), config = {}) => {
  return WS._post(`/proxy/assetdefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": organization}}, config)
  .then(response => {
    response.body.Result.ResultData.AssetEquipment.ASSETID.EQUIPMENTCODE = null
    response.body.Result.ResultData.AssetEquipment.AssetParentHierarchy = {}
    return response
  })
}
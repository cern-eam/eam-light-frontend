import WS from './WS';

export const updateAsset = (asset, config = {}) => {
  return WS._put(`/proxy/assets`, asset, config)
}

export const getAsset = async (equipmentCode, organization, config = {}) => {
    const assetResponse = await WS._get(`/proxy/assets/${encodeURIComponent(equipmentCode + '#' + organization)}`, config)
    const hierarchyResponse = await getAssetHierarchy(equipmentCode, organization, config);
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
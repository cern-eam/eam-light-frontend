import { encodeCodeOrg, getOrg } from '../hooks/tools';
import { GridRequest, GridType } from 'eam-rest-tools';
import { getGridData } from './WSGrids';
import WS from './WS';

export const getEquipmentRevisionsByEquipment = (equipmentCode, config = {}) => {
  const gridRequest = new GridRequest("OSEQRV", GridType.LIST, "OSEQRV")
    .addFilter("equipment", equipmentCode, "=")
    .addFilter("equipmentrevisionrstatus", "U", "=")

  return getGridData(gridRequest, config);
};

export const getEquipmentRevision = (revisionIdentifier, config = {}) => {
  return WS._get(`/proxy/equipmentrevisions/${encodeCodeOrg(revisionIdentifier)}`, config);
};

export const getEquipmentRevisionDefault = (organizationCode = getOrg(), config = {}) => {
  return WS._post('/proxy/equipmentrevisiondefaults', {
    ORGANIZATIONID: {
      ORGANIZATIONCODE: organizationCode,
      DESCRIPTION: "",
    },
  }, config);
};

export const createEquipmentRevisionForEquipment = async (
  equipmentCode,
  equipmentOrg = getOrg(),
  config = {},
) => {
  const defaultsResponse = await getEquipmentRevisionDefault(equipmentOrg, config);
  const revisionDefaults = defaultsResponse.body.Result.ResultData.EquipmentRevisionDefault;

  return WS._post('/proxy/equipmentrevisions', {
    ...revisionDefaults,
    EQUIPMENTREVISIONID: {
      ORGANIZATIONID: {
        ORGANIZATIONCODE:equipmentOrg,
      },
      DESCRIPTION: equipmentCode,
    },
    REVISIONEQUIPMENTID: {
      EQUIPMENTCODE: equipmentCode,
      ORGANIZATIONID: {
        ORGANIZATIONCODE: equipmentOrg,
      },
    },
  }, config);
};

export const createEquipmentRevision = (revision, config = {}) => {
  return WS._post('/proxy/equipmentrevisions', revision, config);
};

export const updateEquipmentRevision = (revision, config = {}) => {
  return WS._put('/proxy/equipmentrevisions', revision, config);
};

export const deleteEquipmentRevision = (revisionIdentifier, config = {}) => {
  return WS._delete(`/proxy/equipmentrevisions/${encodeCodeOrg(revisionIdentifier)}`, config);
};

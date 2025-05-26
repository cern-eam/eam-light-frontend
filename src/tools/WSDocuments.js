import GridRequest, { GridTypes } from "./entities/GridRequest"
import WS from "./WS"
import { getGridData } from "./WSGrids"

const pathMap = {
    PART: 'parts',
    EVNT: 'workorders'
};

export const getDocumentAttachment = async (documentCode, file, uploadType = "MOBILE", config = {}) => {
    const request = {
        "DOCUMENTCODE":documentCode,
        "FILE": file,
        "UPLOADTYPE": uploadType
      }
    return WS._put(`/proxy/documentattachments`, request, config)
}

export const addDocument = async (request, config = {}) => {
    return WS._post(`/proxy/documents`, request, config)
}

export const attachDocument = async (document, rentity, code, config = {}) => {


  const entityPath = pathMap[rentity];
  if (!entityPath) {
    throw new Error(`Unsupported rentity: ${rentity}`);
  }

  const request = {
    DOCUMENTENTITY: {
      DOCUMENTENTITYID: {
        document,
        rentity,
        code
      }
    }
  };

  return WS._post(`/proxy/${entityPath}/documents`, request, config);
};

export const detachDocument = async (parentid, documentid, rentity, config = {}) => {
    const entityPath = pathMap[rentity];
    
    if (!entityPath) {
      throw new Error(`Unsupported rentity: ${rentity}`);
    }

    return WS._delete(`/proxy/${entityPath}/${encodeURIComponent(parentid)}/documents/${documentid}`, config);
}

export const getDocuments = async (code, entity, config = {}) => {
    let gridRequest = new GridRequest("BSDOCP", GridTypes.LIST)
    gridRequest.addParam("param.daerentity", entity)
    gridRequest.addParam("param.daecode", code);
    return getGridData(gridRequest, config)
}

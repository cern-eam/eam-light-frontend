import GridRequest, { GridTypes } from "./entities/GridRequest"
import WS from "./WS"
import { getGridData } from "./WSGrids"

export const getDocumentAttachment = async (documentCode, file, uploadType = "MOBILE", config = {}) => {
    const request = {
        "DOCUMENTCODE":documentCode,
        "FILE": file,
        "UPLOADTYPE": uploadType
      }
    return WS._put(`/proxy/documentattachments`, request, config)
}

export const getDocuments = async (code, entity, config = {}) => {
    let gridRequest = new GridRequest("BSDOCP", GridTypes.LIST)
    gridRequest.addParam("param.daerentity", entity)
    gridRequest.addParam("param.daecode", code);
    return getGridData(gridRequest, config)
}

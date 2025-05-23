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

export const getEquipmentDocuments = async (code, organization, config = {}) => {
    let gridRequest = new GridRequest("BCDOCOBJ_IPAD", GridTypes.LIST)
    gridRequest.addParam("parameter.code1", code)
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    return getGridData(gridRequest)
}

export const getWorkOrderDocuments = async (code, organization, mrc, config = {}) => {
    let gridRequest = new GridRequest("BCDOCWO_IPAD", GridTypes.LIST)
    gridRequest.addParam('parameter.womrc', 'Y')
    gridRequest.addParam('parameter.wmrc1', mrc)
    gridRequest.addFilter("doc_entitycode", code, "=");
    gridRequest.addParam("parameter.lastupdated", "31-JAN-1970");
    return getGridData(gridRequest)
}
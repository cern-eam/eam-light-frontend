import WS from "./WS"

export const getDocumentAttachment = async (documentCode, file, uploadType = "MOBILE", config = {}) => {
    const request = {
        "DOCUMENTCODE":documentCode,
        "FILE": file,
        "UPLOADTYPE": uploadType
       
      }
    return WS._put(`/proxy/documentattachments`, request, config)
}
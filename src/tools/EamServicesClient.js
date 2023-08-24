import {onRequestFulfilledInterceptor} from "../index";
import axios from "axios";

const eamServicesInstance = axios.create({});

const getAllFiles = (edmsId,  config = {}) => {
    eamServicesInstance.interceptors.request.use(onRequestFulfilledInterceptor, (error) => Promise.reject(error));
    return eamServicesInstance.get(process.env.REACT_APP_EAM_SERVICES_URL + `/edms/fileNames?edmsid=${edmsId}`, config);
}

export default {
    getAllFiles
}

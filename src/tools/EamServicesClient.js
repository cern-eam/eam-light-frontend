import {onRequestFulfilledInterceptor} from "../index";
import axios from "axios";


const getInstance = async () => {
    const eamServicesInstance = axios.create({
    });
    eamServicesInstance.interceptors.request.use(onRequestFulfilledInterceptor, (error) => Promise.reject(error));
    eamServicesInstance.get(process.env.REACT_APP_EAM_SERVICES_URL + "/edms/file?edmsid=2072511&version=1&filename=Screenshot_from_2022-09-19_23-55-08.png&filetype=IMAGE&convertedname=")
}

export default {
    getInstance
}

import { getOrg } from "../hooks/tools";
import WS from "./WS";

class WSNCRs {
    initNonConformity(config = {}) {
        return WS._post(`/proxy/nonconformitydefaults`, {"ORGANIZATIONID": { "ORGANIZATIONCODE": getOrg()}}, config);
    }

    getNonConformity(number, organization, config = {}) {
        return WS._get(`/proxy/nonconformities/${encodeURIComponent(number + '#' + organization)}`, config);
    }

    createNonConformity(workOrder, config = {}) {
        return WS._post('/proxy/nonconformities/', workOrder, config);
    }

    updateNonConformity(workOrder, config = {}) {
        return WS._put('/proxy/nonconformities/', workOrder, config);
    }

    deleteNonConformity(number, organization, config = {}) {
        return WS._delete('/proxy/nonconformities/' + number+ '%23' + organization, config);
    }

    getNonConformityObservations(code, config = {}) {
        return WS._get(`/ncrobservations/${code}`, config);
    }

    createObservation(observation, config = {}) {
        return WS._post(`/ncrobservations/`, observation, config);
    }

    getEquipmentNonConformities(asset, config = {}) {
        return WS._get(`/ncrs/equipment/${asset}`, config)
    }
}

export default new WSNCRs();

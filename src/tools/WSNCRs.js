import WS from "./WS";

class WSNCRs {
    getNonConformity(code, config = {}) {
        return WS._get(`/ncrs/${code}`, config);
    }

    updateNonConformity(ncr, config = {}) {
        return WS._put("/ncrs/", ncr, config);
    }

    createNonConformity(ncr, config = {}) {
        return WS._post("/ncrs/", ncr, config);
    }

    deleteNonConformity(code, config = {}) {
        return WS._delete(`/ncrs/${code}`, config);
    }

    initNonConformity(config = {}) {
        return WS._get(`/ncrs/init`, config);
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

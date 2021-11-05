import ajax from 'eam-components/dist/tools/ajax';

// const_get(url, config = {}) {
//     return ajax.get(process.env.REACT_APP_BACKEND + url, config);
// }

// _post(url, data, config = {}) {
//     return ajax.post(process.env.REACT_APP_BACKEND + url, data, config);
// }

// _put(url, data, config = {}) {
//     return ajax.put(process.env.REACT_APP_BACKEND + url, data, config);
// }

// _delete(url, config = {}) {
//     return ajax.delete(process.env.REACT_APP_BACKEND + url, config);
// }

class WSJMTIntegration {

    constructor(baseUrl, config = {}) {
        this.baseUrl = baseUrl;
        this.config = {}
    }

    createJMTJob(woCode) {
        return ajax.post(this.baseUrl + `/jmt/workorders/${woCode}/jmtjobs`, {}, this.config);
    }

    createJMTJobAndCost(woCode) {
        return ajax.post(this.baseUrl + `/jmt/workorders/${woCode}/jmtjobsandcost`, {}, this.config);
    }

    addCostLines(woCode, jmtJobNo, costType) {
        return ajax.post(this.baseUrl + `/jmt/workorders/${woCode}/jmtjobs/${jmtJobNo}/cost?costType=${costType}`, {}, this.config);
    }
}

export default new WSJMTIntegration(process.env.REACT_APP_BACKEND.replace('/eamlightws/rest', '/cern-eam-services/rest'));
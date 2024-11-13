import WS from './WS';
  
export function getNonConformity(code, config = {}) {
    return WS._get(`/ncrs/${code}`, config);
}

export function updateNonConformity(ncr, config = {}) {
    return WS._put('/ncrs/', ncr, config);
}

export function createNonConformity(ncr, config = {}) {
    return WS._post('/ncrs/', ncr, config);
}

export function deleteNonConformity(code, config = {}) {
    return WS._delete(`/ncrs/${code}`, config);
}

export function initNonConformity(config = {}) {
    return WS._get(`/ncrs/init`, config);
}

  
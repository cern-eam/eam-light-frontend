import WS from './WS';

export const getPosition = async (equipmentCode, organization, config = {}) => {
    return WS._get(`/proxy/positions/${encodeURIComponent(equipmentCode + '#' + organization)}`, config)
}
import WS from './WS';

/**
 * Handles all calls to REST Api related with the meter readings
 */
class WSMeters {


    getReadingsByWorkOrder(workorder, config = {}) {
        return WS._get(`/meters/read/wo/${workorder}`, config);
    }

    getReadingsByEquipment(equipmentCode, config = {}) {
        equipmentCode = encodeURIComponent(equipmentCode);
        return WS._get(`/meters/read/eqp/${equipmentCode}`, config);
    }

    getReadingsByMeterCode(meterCode, config = {}) {
        meterCode = encodeURIComponent(meterCode);
        return WS._get(`/meters/read/meter/${meterCode}`, config);
    }

    checkValueRollOver(equipment, uom, actualValue, config = {}) {
        equipment = encodeURIComponent(equipment);
        uom = encodeURIComponent(uom);
        return WS._get(`/meters/check?equipment=${equipment}&uom=${uom}&actualValue=${actualValue}`, config);
    }

    createMeterReading(meterReading, config = {}) {
        return WS._post('/meters/', meterReading);
    }

    autocompleteMeterEquipment = ({filter}, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/meters/equipment/${filter}`, config);
    };

    autocompleteMeterCode = ({filter}, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get(`/autocomplete/meters/meter/${filter}`, config);
    };
}

export default new WSMeters();
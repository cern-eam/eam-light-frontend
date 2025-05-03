import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';

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
        let gridRequest = new GridRequest("OSMETE", GridTypes.LIST, "OSMETE");
        gridRequest.setRowCount(10)
		gridRequest.addFilter("equipment", filter, "BEGINS");
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "equipment", desc: "meterunit"}));
    };

    autocompleteMeterCode = ({filter}, config = {}) => {
        let gridRequest = new GridRequest("OSMETE", GridTypes.LIST, "OSMETE");
        gridRequest.setRowCount(10)
		gridRequest.addFilter("metercode", filter, "BEGINS");
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "metercode", desc: "meterunit"}));
    };
}

export default new WSMeters();
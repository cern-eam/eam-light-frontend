import { get } from 'lodash';
import { fromEAMNumber } from '../ui/pages/EntityTools';
import GridRequest, { GridTypes } from './entities/GridRequest';
import WS from './WS';
import { getGridData, transformResponse } from './WSGrids';
import { getOrg } from '../hooks/tools';

/**
 * Handles all calls to REST Api related with the meter readings
 */
class WSMeters {


    getReadingsByWorkOrder(workorder, config = {}) {
        return WS._get(`/meters/read/wo/${workorder}`, config);
    }

    async getReadingsByEquipment(equipmentCode, equipmentOrg, config = {}) {
		let gridRequest = new GridRequest("OSMETE", GridTypes.LIST, "OSOBJA");

		gridRequest.addParam("parameter.organization", equipmentOrg);
		gridRequest.addParam("parameter.object", equipmentCode);

        if (equipmentCode) {
			gridRequest.addFilter("equipment", equipmentCode, "=");
		}

        let equipmentMeters = await getGridData(gridRequest, config).then(response => transformResponse(response, {equipment: "equipment", meter: "metercode", org: "organization"}));
        const readings = await Promise.all(
            equipmentMeters.body.data.map(equipmentMeter =>
                this.getReadingsByMeterCode(equipmentMeter.meter, equipmentMeter.org)
            )
        );
    
        return readings;
    }

     async getReadingsByMeterCode(meterCode, org, config = {}) {
        let meterResult = await WS._get(`/proxy/physicalmeters/${encodeURIComponent(meterCode + '#' + org)}`, config)
        let meterData = meterResult.body.Result.ResultData.PhysicalMeter
        
        const result = {
            lastUpdateDate: null,
            lastValue: fromEAMNumber(get(meterData, 'LASTMETERREADING', null), false),
            rolloverValue: fromEAMNumber(get(meterData, 'ROLLOVERPOINT', null), false),
            uomDesc: get(meterData, 'METERUOM.DESCRIPTION', null),
            uom: get(meterData, 'METERUOM.UOMCODE', null),
            meterName: get(meterData, 'METERID.METERCODE', null),
            equipmentCode:
              get(meterData, 'ServicePoint.ASSETID.EQUIPMENTCODE') ??
              get(meterData, 'ServicePoint.POSITIONID.EQUIPMENTCODE') ??
              null,
            equipmentOrg:
              get(meterData, 'ServicePoint.ASSETID.ORGANIZATIONID.ORGANIZATIONCODE') ??
              get(meterData, 'ServicePoint.POSITIONID.ORGANIZATIONID.ORGANIZATIONCODE') ??
              null,
          };

          return result
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
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "equipment", desc: "meterunit", org: "organization"}));
    };

    autocompleteMeterCode = ({filter}, config = {}) => {
        let gridRequest = new GridRequest("OSMETE", GridTypes.LIST, "OSMETE");
        gridRequest.setRowCount(10)
		gridRequest.addFilter("metercode", filter, "BEGINS");
        return getGridData(gridRequest, config).then(response => transformResponse(response, {code: "metercode", desc: "meterunit", org: "organization"}));
    };
}

export default new WSMeters();
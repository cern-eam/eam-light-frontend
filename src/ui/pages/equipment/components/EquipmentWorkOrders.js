import React, {useState, useEffect} from 'react';
import {format} from 'date-fns'
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable, {TRANSFORM_KEYS} from 'eam-components/ui/components/table';
import EISTableFilter from 'eam-components/ui/components/table/EISTableFilter';
import EquipmentMTFWorkOrders from "./EquipmentMTFWorkOrders"
import BlockUi from 'react-block-ui';
import { isCernMode } from '../../../components/CERNMode';
import Constants from 'eam-components/enums/Constants';
import useLocalStorage from '../../../../hooks/useLocalStorage';

const WO_FILTER_TYPES = {
    ALL: 'All',
    OPEN: 'Open',
    MTF: 'MTF',
    THIS: 'This Eqp'
}

const WO_FILTERS = {
    [WO_FILTER_TYPES.ALL]: {
        text: WO_FILTER_TYPES.ALL,
        process: (data) => {
            return [...data];
        }
    },
    [WO_FILTER_TYPES.OPEN]: {
        text: WO_FILTER_TYPES.OPEN,
        process: (data) => {
            return data.filter((workOrder) => workOrder.status && ['T', 'C'].every(statusCode => !workOrder.status.startsWith(statusCode)));
        }
    },
    ...isCernMode ? {[WO_FILTER_TYPES.MTF]: {
        text: WO_FILTER_TYPES.MTF,
        process: (data) => {
            return data.filter((workOrder) => {
                return workOrder.mrc && (workOrder.mrc.startsWith("ICF") || workOrder.mrc.startsWith("MTF"));
            })
        }
    }} : {},
    [WO_FILTER_TYPES.THIS]: {
        text: WO_FILTER_TYPES.THIS,
        process: data => [...data]
    }
}

const LOCAL_STORAGE_FILTER_KEY = 'filters:workorders';

function EquipmentWorkOrders(props) {
    const { defaultFilter, equipmentcode, equipmenttype } = props;

    let [events, setEvents] = useState([]);
    let [workorders, setWorkorders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [workOrderFilter, setWorkOrderFilter] = useLocalStorage(LOCAL_STORAGE_FILTER_KEY, WO_FILTER_TYPES.ALL, defaultFilter);
    let headers = ['Work Order', 'Equipment', 'Description', 'Status', 'Creation Date'];
    let propCodes = ['number', 'object','desc', 'status', 'createdDate'];

    if (workOrderFilter === WO_FILTER_TYPES.THIS) {
        headers = ['Work Order', 'Description', 'Status', 'Creation Date'];
        propCodes = ['number', 'desc', 'status', 'createdDate'];
    }

    // make spaces in header strings non-breaking so headers do not wrap to multiple lines
    headers = headers.map(string => string.replaceAll(' ', '\u00a0'));

    const linksMap = new Map([
        ['number', {
            linkType: 'fixed',
            linkValue: 'workorder/',
            linkPrefix: '/'
        }],
        ['object', {
            linkType: 'dynamic',
            linkValue: 'objectUrl',
            linkPrefix: '/'
        }]
    ]);

    const stylesMap = {
        number: {
            overflowWrap: 'anywhere'
        }
    };

    const keyMap = {
        createdDate: TRANSFORM_KEYS.DATE_DD_MMM_YYYY
    }

    let getFilteredWorkOrderList = (workOrders) => {
        return WO_FILTERS[workOrderFilter].process(workOrders)
    }

    useEffect(() => {
        if (equipmentcode) {
            fetchData(equipmentcode, equipmenttype);
        } else {
            setWorkorders([]);
            setEvents([]);
        }
    }, [equipmentcode, equipmenttype])

    const getUrl = (equipmentType, objectCode) => {
        const linkPrefix = {
            A: 'asset',
            P: 'position',
            S: 'system',
            L: 'location',
        }[equipmentType];

        return linkPrefix ? `${linkPrefix}/${objectCode}` : '';
    }

    const fetchData = (equipmentCode, equipmentType) => {
        Promise.all([WSEquipment.getEquipmentWorkOrders(equipmentCode), WSEquipment.getEquipmentEvents(equipmentCode, equipmentType)])
            .then(responses => {
                const formatResponse = response => response.body.data.map(element => ({
                    ...element,
                    createdDate: element.createdDate && format(new Date(element.createdDate),'dd-MMM-yyyy'),
                    objectUrl: getUrl(element.equipmentType, element.object)
                }));

                const [workorders, events] = responses.map(formatResponse);
                setWorkorders(workorders);
                setEvents(events);
            })
            .finally(() => setLoadingData(false));
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <EISTableFilter
                filters={WO_FILTERS}
                handleFilterChange={(newFilter) =>
                    setWorkOrderFilter(newFilter)
                }
                activeFilter={workOrderFilter}
                />
                
            {workOrderFilter === WO_FILTER_TYPES.MTF ?
                <EquipmentMTFWorkOrders equipmentcode={equipmentcode} />
                :
                <BlockUi blocking={loadingData} style={{overflowX: 'auto'}}>
                    <EISTable
                    data={getFilteredWorkOrderList(workOrderFilter === WO_FILTER_TYPES.THIS ? workorders : events)}
                    headers={headers}
                    propCodes={propCodes}
                    linksMap={linksMap}
                    stylesMap={stylesMap}
                    keyMap={keyMap}
                    defaultOrderBy='createdDate'
                    defaultOrder={Constants.SORT_DESC}
                    />
                </BlockUi>
            }
        </div>
    )

}

export default React.memo(EquipmentWorkOrders)
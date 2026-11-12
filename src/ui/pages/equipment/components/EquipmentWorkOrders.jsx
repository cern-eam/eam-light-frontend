import React, {useState, useEffect} from 'react';
import BlockUi from 'react-block-ui';
import useLocalStorage from '../../../../hooks/useLocalStorage.js';
import EISTable from 'eam-components/src/ui/components/table/index.js';
import {Chip} from "@mui/material";
import useApplicationDataStore from "../../../../state/useApplicationDataStore.js";
import Constants from 'eam-components/dist/enums/Constants';
import {
    AVAILABLE_FILTERS,
    buildEventsRequest,
    getColumnsBasedOnFilter,
    getDateForStatus, toRows,
    WO_FILTER_TYPES
} from "./utils.js";
import {getGridData} from "../../../../tools/WSGrids.js";

const LOCAL_STORAGE_FILTER_KEY = 'filters:workorders';

const EquipmentWorkOrders = (props) => {
    const {defaultFilter: initialFilter, equipmentcode, equipmentorg, screencode} = props;
    const defaultFilter = initialFilter ?? WO_FILTER_TYPES.THIS;
    const {applicationData} = useApplicationDataStore();
    const [dataByFilter, setDataByFilter]= useState({});
    const [workOrderFilter, setWorkOrderFilter] = useLocalStorage(LOCAL_STORAGE_FILTER_KEY, WO_FILTER_TYPES.ALL, defaultFilter);
    const [headers, propCodes] = getColumnsBasedOnFilter(workOrderFilter);

    const isMtf = workOrderFilter === WO_FILTER_TYPES.MTF;
    const linksMap = new Map(isMtf
        ? [['mtf_step', { linkType: 'dynamic', linkValue: 'stepUrl', linkPrefix: '/' }]]
        : [['eventno',   { linkType: 'fixed',   linkValue: 'workorder/', linkPrefix: '/' }],
            ['equipment', { linkType: 'dynamic', linkValue: 'objectUrl',  linkPrefix: '/' }]]);

    const stylesMap = {
        eventno: {
            overflowWrap: 'anywhere'
        }
    };

    useEffect(() => {
        setDataByFilter({});
        if (!equipmentcode) return;

        let cancelled = false;
        AVAILABLE_FILTERS.forEach(filter => {
            const request = buildEventsRequest(equipmentcode, equipmentorg, filter, screencode, applicationData);
            getGridData(request)
                .then(response => {
                    if (!response) throw new Error('Grid Request failed');
                    return toRows(response);
                })
                .catch(error => {
                    console.error('Grid Request failed: ', error);
                    return [];
                })
                .then(rows => {
                    if (!cancelled) setDataByFilter(prev => ({ ...prev, [filter]: rows }));
                });
        });
        return () => { cancelled = true; };
    }, [equipmentcode, equipmentorg, screencode, applicationData]);

    const events = dataByFilter[workOrderFilter] ?? [];
    const loadingData = !!equipmentcode && dataByFilter[workOrderFilter] === undefined;

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-start', marginBottom: 4 }}>
                {AVAILABLE_FILTERS.map(filter => (
                    <Chip
                        key={filter}
                        size="small"
                        label={filter}
                        color={filter === workOrderFilter ? 'primary' : 'default'}
                        variant={filter === workOrderFilter ? 'filled' : 'outlined'}
                        onClick={() => { setWorkOrderFilter(filter); }}
                    />
                ))}
            </div>
            <BlockUi blocking={loadingData} style={{overflowX: 'auto'}}>
                <EISTable
                    key={workOrderFilter}
                    stickyHeader
                    defaultOrderBy={isMtf ? 'mtf_step' : 'displaydate'}
                    defaultOrder={isMtf ? Constants.SORT_ASC: Constants.SORT_DESC}
                    data={events}
                    headers={headers}
                    propCodes={propCodes}
                    linksMap={linksMap}
                    stylesMap={stylesMap}
                    keyMap={{
                        displaydate: v => (v instanceof Date ? v.getTime() : 0),
                        mtf_step: v => { const n = parseFloat(v); return Number.isNaN(n) ? Infinity : n; },
                    }}
                    cellRenderer={({ propCode, row }) => {
                        switch (propCode) {
                            case 'displaydate': {
                                const result = getDateForStatus(row);
                                return result
                                    ? <span style={{ whiteSpace: 'nowrap', display: "flex", gap: "4px" }}>
                                        {result.date}
                                        <span style={{ color: 'gray', fontSize: '0.75rem' }}>({result.label})</span>
                                      </span>
                                    : '-';
                            }
                            case 'last_repeated_status_color':
                                return <div style={{ width: 16, height: 16, borderRadius: 4, background: row.last_repeated_status_color || 'transparent' }} />;
                            default:
                                return undefined;
                        }

                    }}
                />
            </BlockUi>
        </div>
    )
}

export default React.memo(EquipmentWorkOrders);

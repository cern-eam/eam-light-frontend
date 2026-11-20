import {GridRequest, GridType} from "eam-rest-tools";
import {isCernMode} from "../../../components/CERNMode.js";
import {format, isValid, parse} from "date-fns";

export const WO_FILTER_TYPES = {
    ALL: 'All',
    OPEN: 'Open',
    THIS: 'This Eqp',
    MTF: 'MTF',
};

const DATASPY_BY_FILTER = {
    [WO_FILTER_TYPES.ALL]: 'EL_EVAL',
    [WO_FILTER_TYPES.THIS]: 'EL_EVTE',
    [WO_FILTER_TYPES.OPEN]: 'EL_EVOP',
};

/**
 * Only when CERN Mode is enabled, the MTF filter is available
 */
export const AVAILABLE_FILTERS = Object.values(WO_FILTER_TYPES)
    .filter(filter => isCernMode || filter !== WO_FILTER_TYPES.MTF);

export const buildEventsRequest = (
    equipmentCode,
    equipmentOrg,
    filter,
    userFunctionName,
    applicationData
) => {
    const request = filter === WO_FILTER_TYPES.MTF
        ? new GridRequest('OSOBJA_XTF', GridType.LIST).addParam('obj_code', equipmentCode)
        : new GridRequest('OSVEVT', GridType.LIST, userFunctionName)
            .setRowCount(5000)
            .addParam('parameter.object', equipmentCode)
            .addParam('parameter.objorganization', equipmentOrg);

    const dataspyKey = DATASPY_BY_FILTER[filter];
    if (dataspyKey) {
        request.setDataspy(applicationData?.[dataspyKey]);
    }

    return request;
}

export const getColumnsBasedOnFilter = (filterType) => {
    switch (filterType) {
        case WO_FILTER_TYPES.THIS: {
            const headers = ['Work Order', 'Description', 'Status', 'Date'];
            const propCodes = ['eventno', 'description', 'statusdisplay', 'displaydate'];
            return [
                headers.map(string => string.replaceAll(' ', '\u00a0')),
                propCodes
            ];
        }
        case WO_FILTER_TYPES.MTF: {
            const headers = ['Step', 'Description', 'Status', 'Result', 'NC', 'Updated By'];
            const propCodes = ['mtf_step', 'evt_desc', 'evt_status_desc', 'mtf_step_result', 'last_repeated_status_color', 'evt_updatedby'];
            return [
                headers.map(string => string.replaceAll(' ', '\u00a0')),
                propCodes
            ];
        }
        default: {
            const headers = ['Work Order', 'Equipment', 'Description', 'Status', 'Date'];
            const propCodes = ['eventno', 'equipment', 'description', 'statusdisplay', 'displaydate'];
            return [
                headers.map(string => string.replaceAll(' ', '\u00a0')),
                propCodes
            ];
        }
    }
}

const CREATED = { field: 'datecreated', label: 'Created' };

const DATE_RULES = [
    {
        matches: status => status.startsWith('R'),
        dates: [
            { field: 'schedstartdate', label: 'Sched. Start' },
            { field: 'reqenddate', label: 'Due Date' },
            { field: 'datereported', label: 'Reported' },
            CREATED,
        ],
    },
    {
        matches: status => status.startsWith('T'),
        dates: [{ field: 'completiondate', label: 'Completed' }],
    },
];
const DEFAULT_DATES = [CREATED];

// "20-AUG-2025" or "20-AUG-2025 07:46" -> Date (or null if unparseable)
export const parseEamDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return isValid(value) ? value : null;
    const hasTime = value.includes(' ');
    const parsed = parse(value, hasTime ? 'dd-MMM-yyyy HH:mm' : 'dd-MMM-yyyy', new Date());
    return isValid(parsed) ? parsed : null;
};

// Date or string -> "20-Aug-2025"
const formatEamDate = (value) => {
    if (!value) return null;
    const parsed = parseEamDate(value);
    return parsed ? format(parsed, 'dd-MMM-yyyy') : String(value); // show raw text rather than crash
};

export const getDateForStatus = (row) => {
    const status = row.statusdisplay ?? '';
    const rule = DATE_RULES.find(r => r.matches(status));
    for (const { field, label } of (rule ? rule.dates : DEFAULT_DATES)) {
        const date = formatEamDate(row[field]);
        if (date) return { date, label, rawDate: row[field] };
    }
    return null;
};

export const toRows = response => (response?.body?.data ?? []).map(element => {
    const row  = {
        ...element,
        schedstartdate: parseEamDate(element.schedstartdate) ?? element.schedstartdate,
        reqenddate: parseEamDate(element.reqenddate) ?? element.reqenddate,
        datereported: parseEamDate(element.datereported) ?? element.datereported,
        completiondate: parseEamDate(element.completiondate) ?? element.completiondate,
        datecreated: parseEamDate(element.datecreated) ?? element.datecreated,
        objectUrl: `equipment/${encodeURIComponent(element.equipment || '')}`,
        stepUrl: `workorder/${encodeURIComponent(element.evt_code || '')}`,
    };
    return { ...row, displaydate: parseEamDate(getDateForStatus(row)?.rawDate) }
});

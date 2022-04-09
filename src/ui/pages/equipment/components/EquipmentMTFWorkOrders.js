import React from "react";
import { DATA_GRID_SORT_TYPES, DATA_GRID_SORT_DIRECTIONS } from "eam-components/ui/components/datagrid/Constants";
import EAMTable from "eam-components/ui/components/eamtable/EAMTable";
import { Link } from 'react-router-dom';
import EAMTableGridRequestAdapter from "eam-components/ui/components/eamtable/EAMTableGridRequestAdapter";
import compareAsc from 'date-fns/compareAsc'
import parse from 'date-fns/parse'
import { withCernMode } from '../../../components/CERNMode';

const DATE_FORMAT = "dd-LLL-yyyy";

const customCellStyle = {
    whiteSpace: "nowrap"
}

const customCellRenderer = ({ row, columnMetadata, getDisplayValue, CellComponent }) => {
    const customRenders = {
        "last_repeated_status_color": (
            <CellComponent
                style={{ backgroundColor: getDisplayValue() }}
            />
        ),
        "mtf_step": (
            <CellComponent>
                <Link
                    to={{ pathname: `/workorder/${row["evt_code"]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        ),
        "evt_desc": (
            <CellComponent>{getDisplayValue()}</CellComponent>
        )
    }
    return customRenders[columnMetadata.id] || <CellComponent style={customCellStyle}>{getDisplayValue()}</CellComponent>;
}

const headers = {
    mtf_step: "Step",
    evt_status_desc: "Status",
    mtf_step_result: "Result",
    last_repeated_status_color: "NC",
    evt_desc: "Description",
    evt_completed: "Completed On",
    evt_updatedby: "Updated By"
};

const sortTypesMap = {
    "mtf_step": DATA_GRID_SORT_TYPES.NUMERIC
}

const comparatorsMap = {
    "evt_completed": ({ direction, property }) => {
        return (a, b) => (direction === DATA_GRID_SORT_DIRECTIONS.DESC ? 1 : -1) * compareAsc(parse(a[property], DATE_FORMAT, new Date()), parse(b[property], DATE_FORMAT, new Date()))   
    }
}

const getComputedColumnsMetadata = ({ columnsMetadata }) => {
    const availableHeaders = Object.keys(headers);
    return columnsMetadata.filter(e => availableHeaders.includes(e.id))
        .map(c => ({
            ...c,
            sortType: sortTypesMap[c.id],
            comparator: comparatorsMap[c.id]
        }));
}


const EquipmentMTFWorkOrders = props => {
    const { equipmentcode } = props;

    const gridRequest = {
        rowCount: 1000,
        cursorPosition: 1,
        params: {
            obj_code: equipmentcode
        },
        gridName: "OSOBJA_XTF",
        useNative: true,
        includeMetadata: true
    };

    return (
        <EAMTableGridRequestAdapter gridRequest={gridRequest} headers={headers}>
            {({ loading, requestError, rows, columnsMetadata }) =>
                <EAMTable
                    loading={loading}
                    rows={rows}
                    columnsMetadata={getComputedColumnsMetadata({ columnsMetadata })}
                    isSortEnabled={columnMetadata => !["last_repeated_status_color", "checkbox"].includes(columnMetadata.id)}
                    sortBy={{ columnID: "mtf_step" }}
                    cellRenderer={customCellRenderer}
                    extraBodyRender={() =>
                        <>
                            {!loading && !requestError && !rows.length && <caption>No MTF Work Orders to show.</caption>}
                            {!loading && requestError && <caption>Failed to load MTF Work Orders</caption>}
                        </>
                    } />
            }
        </EAMTableGridRequestAdapter>
    )
};

export default withCernMode(EquipmentMTFWorkOrders);

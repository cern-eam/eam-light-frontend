import React from "react";
import { DATA_GRID_SORT_TYPES } from "eam-components/dist/ui/components/datagrid/Constants";
import EAMTable from "eam-components/dist/ui/components/eamtable/EAMTable";
import { Link } from 'react-router-dom';
import EAMTableGridRequestAdapter from "eam-components/dist/ui/components/eamtable/EAMTableGridRequestAdapter";


const customCellRenderer = ({ row, columnMetadata, getDisplayValue, CellComponent }) => {
    const customRenders = {
        "last_repeated_status_color": (
            <CellComponent
                style={{ backgroundColor: getDisplayValue() }}
            />
        ),
        "mtf_step": (
            <CellComponent >
                <Link
                    to={{ pathname: `/workorder/${row["evt_code"]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        )
    }
    return customRenders[columnMetadata.id];
}

const headers = {
    mtf_step: "Step",
    evt_status_desc: "Status",
    mtf_step_result: "Result",
    last_repeated_status_color: "NC",
    evt_desc: "Description",
};

const sortTypesMap = {
    "mtf_step": DATA_GRID_SORT_TYPES.NUMERIC
}

const getComputedColumnsMetadata = ({ columnsMetadata }) => {
    return columnsMetadata.filter(e => !["evt_code", "last_repeated_status"].includes(e.id))
        .map(c => ({
            ...c,
            sortType: sortTypesMap[c.id]
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

export default EquipmentMTFWorkOrders;

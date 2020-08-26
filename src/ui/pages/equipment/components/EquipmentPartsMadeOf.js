import React from "react";
import EAMTable from "eam-components/dist/ui/components/eamtable/EAMTable";
import { Link } from 'react-router-dom';
import EAMTableGridRequestAdapter from "eam-components/dist/ui/components/eamtable/EAMTableGridRequestAdapter";

const customCellStyle = {
    whiteSpace: "nowrap",
    padding: 4
}

const customCellRenderer = ({ row, columnMetadata, getDisplayValue, CellComponent }) => {
    const customRenders = {
        "part": (
            <CellComponent style={customCellStyle}>
                <Link
                    to={{ pathname: `/part/${row["part"]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        ),
        "child_equipment": (
            <CellComponent style={customCellStyle}>
                <Link
                    to={{ pathname: `/equipment/${row["child_equipment"]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        ),
        "description": (
            <CellComponent style={{ minWidth: 150, padding: 4 }}>{getDisplayValue()}</CellComponent>
        )
    }
    return customRenders[columnMetadata.id] || <CellComponent style={customCellStyle}>{getDisplayValue()}</CellComponent>;
}

const headers = {
    child_equipment: "Equipment",
    part: "Part",
    description: "Description",
    lot: "Lot",
    quantity: "Quantity",
    uom: "UOM"
};


const EquipmentPartsMadeOf = props => {
    const { equipmentcode } = props;

    const gridRequest = {
        rowCount: 10000,
        cursorPosition: 1,
        params: {
            obj_code: equipmentcode
        },
        gridName: "OSOBJA_XAP",
        useNative: true,
        includeMetadata: true
    };

    return (
        <EAMTableGridRequestAdapter gridRequest={gridRequest} headers={headers}>
            {({ loading, requestError, rows, columnsMetadata }) =>
                <EAMTable
                    loading={loading}
                    rows={rows}
                    columnsMetadata={columnsMetadata}
                    isSortEnabled={() => true}
                    cellRenderer={customCellRenderer}
                    extraBodyRender={() =>
                        <>
                            {!loading && !requestError && !rows.length && <caption>No data to show.</caption>}
                            {!loading && requestError && <caption>Failed to load data</caption>}
                        </>
                    } />
            }
        </EAMTableGridRequestAdapter>
    )
};

export default EquipmentPartsMadeOf;

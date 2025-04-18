import React from 'react'
import EAMTable from "eam-components/dist/ui/components/eamtable/EAMTable";
import EAMTableDataAdapter from "eam-components/dist/ui/components/eamtable/EAMTableDataAdapter";
import { Link } from 'react-router-dom';
import { getAssetsList } from "../../../tools/WSParts";


const customCellRenderer = ({ row, columnMetadata, getDisplayValue, CellComponent }) => {
    const customRenders = {
        "last_repeated_status_color": (
            <CellComponent
                style={{ backgroundColor: getDisplayValue() }}
            />
        ),
        "equipmentno": (
            <CellComponent >
                <Link
                    to={{ pathname: `/asset/${row[columnMetadata.id]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        ),
        "location": (
            <CellComponent >
                <Link
                    to={{ pathname: `/location/${row[columnMetadata.id]}` }}
                >
                    {getDisplayValue()}
                </Link>
            </CellComponent>
        )
    }
    return customRenders[columnMetadata.id];
}

const columnsMetadata = [
    {
        id: "equipmentno",
        header: "Asset"
    },
    {
        id: "equipmentdesc",
        header: "Description"
    },
    {
        id: "assetstatus_display",
        header: "Status"
    },
    {
        id: "department",
        header: "Department"
    },
    {
        id: "location",
        header: "Location"
    }
]

const convertRowData = (responseBody) => responseBody.data || [];

const convertColumnMetadata = () => columnsMetadata;

const PartAssets = (props) => {
    const { partCode } = props

    return (
        <EAMTableDataAdapter
            fetchData={async () => getAssetsList(partCode)}
            convertRowData={convertRowData}
            convertColumnMetadata={convertColumnMetadata}>
            {({ loading, requestError, rows, columnsMetadata }) =>
                <EAMTable
                    loading={loading}
                    rows={rows}
                    columnsMetadata={columnsMetadata}
                    isSortEnabled={() => true}
                    cellRenderer={customCellRenderer}
                    extraBodyRender={() =>
                        <>
                            {!loading && !requestError && !rows.length && <caption>No Assets to show.</caption>}
                            {!loading && requestError && <caption>Failed to load Assets</caption>}
                        </>
                    } />
                }
        </EAMTableDataAdapter>
    )
}

export default PartAssets

import React, { useEffect, useState } from 'react'
import EAMTable from "eam-components/dist/ui/components/eamtable/EAMTable";
import EAMTableDataAdapter from "eam-components/dist/ui/components/eamtable/EAMTableDataAdapter";
import { Link } from 'react-router-dom';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSParts from "../../../tools/WSParts";


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
        header: "Asset Code"
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
        header: "Location Code"
    }
]

const convertRowData = (responseBody) => responseBody.data || [];

const convertColumnMetadata = () => columnsMetadata;

const PartAssets = (props) => {
    const { partCode, heading } = props

    return (
        <EISPanel heading={heading} detailsStyle={{ display: 'flex', flexDirection: 'column' }}>
            <EAMTableDataAdapter
                fetchData={async () => WSParts.getAssetsList(partCode)}
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
        </EISPanel>
    )
}

export default PartAssets

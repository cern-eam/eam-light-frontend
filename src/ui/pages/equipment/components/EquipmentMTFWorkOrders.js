import React, { useState, useEffect } from "react";
import GridWS from "eam-components/dist/ui/components/eamgrid/lib/GridWS";
import { DataGrid, DataGridSortingState } from "eam-components/dist/ui/components/datagrid";
import { DATA_GRID_SORT_TYPES, DATA_GRID_SORT_DIRECTIONS } from "eam-components/dist/ui/components/datagrid/Constants";
import { MUITableHeader, MUITableBody } from "eam-components/dist/ui/components/datagrid/presentation/table";
import { Table, TableCell, TableContainer, withStyles } from "@material-ui/core";
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';


const flattenGridRow = row => row.map(row => row &&row.cell &&
    row.cell.reduce(
        (acc, cell) => ({
            ...acc,
            [cell.t]: cell.value
        }),
        {}
    )
);

const getGridFieldsColumns = (gridFields, headers) =>
    gridFields.map(gf => ({
        id: gf.name,
        header: headers[gf.name],
        width: gf.width
    }));

const bodyCellRender = ({ row, column, key, getValue, CustomTableCell }) =>
    column.id === "last_repeated_status_color" ? (
        <CustomTableCell style={{ backgroundColor: getValue() }} key={key} />
    ) : column.id === "mtf_step" ? (
        <CustomTableCell key={key}>
            <Link
                to={{ pathname:`/workorder/${row["evt_code"]}` }}
            >
                {getValue()}
            </Link>
        </CustomTableCell>
    ) : (
        <CustomTableCell key={key}>
            {getValue()}
        </CustomTableCell>
    );

const headers = {
    mtf_step: "Step",
    evt_status_desc: "Status",
    mtf_step_result: "Result",
    last_repeated_status_color: "NC",
    evt_desc: "Description",
};

const CustomTableCell = withStyles(theme => ({
    head: {
      padding: theme.spacing(0.5),
    },
    body: {
        padding: theme.spacing(0.5),
    },
}))(TableCell);

const EquipmentMTFWorkOrders = props => {
    const { equipmentcode } = props;
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        (async () => {
            const gridRequest = {
                rowCount: 1000,
                cursorPosition: 1,
                gridSort: [],
                params: {
                    obj_code: equipmentcode
                },
                gridName: "OSOBJA_XTF",
                useNative: true,
                includeMetadata: true
            };
            const response = await GridWS.getGridData(gridRequest).catch(() => {
                setLoading(false);
                setRequestError(true);
                return;
            });
            const result = response && response.body && response.body.data;
            if (!result) return;
            setRows(flattenGridRow(result.row));
            setColumns(getGridFieldsColumns(result.gridField, headers));
            setLoading(false);
        })();
    }, []);

    const visibleColumns = columns.filter(
        e => !["evt_code", "last_repeated_status"].includes(e.id)
    );

    const sortTypesMap = {
        "mtf_step": DATA_GRID_SORT_TYPES.NUMERIC
    }

    const sortableColumns = columns
        .filter(c => !["last_repeated_status_color"].includes(c.id))
        .map(e => ({
            id: e.id,
            sortType: sortTypesMap[e.id]
        }));
    return (
        loading ?
            <div style={{ textAlign: "center", padding: 14 }}>
                <Fade
                    in={loading}
                    style={{ transitionDelay: loading ? "200ms" : "0ms" }}
                    unmountOnExit>
                    <CircularProgress />
                </Fade>
            </div>
            :
            <DataGrid
                rows={rows}
                columns={visibleColumns}
                enableSorting
                sortableColumns={sortableColumns}
            >
                <TableContainer>
                    <Table size="small">
                        <DataGridSortingState columnID={"mtf_step"} direction={DATA_GRID_SORT_DIRECTIONS.ASC} />
                        <MUITableHeader CustomTableCell={CustomTableCell} />
                        <MUITableBody CustomTableCell={CustomTableCell} customCellRender={bodyCellRender} />
                        {!loading && !requestError && !rows.length && <caption>No MTF Work Orders to show.</caption>}
                        {!loading && requestError && <caption>Failed to load MTF Work Orders</caption>}
                    </Table>
                </TableContainer>
            </DataGrid>
    );
};

export default EquipmentMTFWorkOrders;

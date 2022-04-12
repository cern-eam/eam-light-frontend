import React from "react";
import { DataGrid } from "../datagrid";
import { MUITableHeader, MUITableBody } from "../datagrid/presentation/table";
import { Table, TableCell, TableContainer, Checkbox, Fade, withStyles } from "@material-ui/core";
import BlockUi from 'react-block-ui';


const CustomCellComponent = withStyles(theme => ({
    head: {
        padding: theme.spacing(0.5),
    },
    body: {
        padding: theme.spacing(0.5),
    },
}))(TableCell);

const CustomCheckbox = withStyles({
    root: {
        padding: "0 !important",
        margin: "0 !important",
    },
})(Checkbox);


const EAMTable = (props) => {
    const {
        loading,
        rows,
        columnsMetadata,
        isSortEnabled,
        sortBy,
        selectRowsEnabled,
        isRowSelectable,
        isRowSelected,
        onSelectRow,
        cellRenderer,
        extraBodyRender
    } = props;

    const defaultCellRenderer = ({ row, columnMetadata, getDisplayValue, CellComponent }) => {

        if (columnMetadata.id === "__checkbox__") {
            return isRowSelectable && isRowSelectable({ row, columnMetadata }) ? (
                <CellComponent >
                    <CustomCheckbox
                        checked={isRowSelected({ row, columnMetadata })}
                        color="primary"
                        onChange={({ row, columnMetadata }) => onSelectRow({ row, columnMetadata })} 
                    />
                </CellComponent>
            ) : null;
        }
        return (cellRenderer && cellRenderer({ row, columnMetadata, getDisplayValue, CellComponent })) || <CellComponent>{getDisplayValue()}</CellComponent>
    }

    let computedColumnsMetadata = columnsMetadata;
    if (selectRowsEnabled) {
        const extraColumnsMetadata = [{
            id: '__checkbox__'
        }];
        computedColumnsMetadata = [...extraColumnsMetadata, ...columnsMetadata];
    }


    return loading ? (
            <div style={{ textAlign: "center", padding: 14 }}>
                <Fade
                    in={loading}
                    style={{ transitionDelay: loading ? "200ms" : "0ms" }}
                    unmountOnExit>
                    <BlockUi blocking={loading}/>
                </Fade>
            </div>
        ) : (
            <DataGrid
                rows={rows}
                columnsMetadata={computedColumnsMetadata}
                isSortEnabled={isSortEnabled}
                sortBy={sortBy}>
                <TableContainer>
                    <Table size="small">
                        <MUITableHeader CellComponent={CustomCellComponent} />
                        <MUITableBody cellRenderer={defaultCellRenderer} />
                        {extraBodyRender && extraBodyRender()}
                    </Table>
                </TableContainer>
            </DataGrid>
        )
    ;
};

export default EAMTable;

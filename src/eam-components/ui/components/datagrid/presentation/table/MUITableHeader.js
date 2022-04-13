import React from "react";
import { DataGridContext } from "../../DataGridContext";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { DATA_GRID_SORT_DIRECTIONS } from "../../Constants";

const createSortHandler = ({ columnID, sortState }) => event => {
    const isAsc = sortState.columnID === columnID && sortState.direction === DATA_GRID_SORT_DIRECTIONS.ASC;
    sortState.setColumnID(columnID);
    sortState.setDirection(isAsc ? DATA_GRID_SORT_DIRECTIONS.DESC : DATA_GRID_SORT_DIRECTIONS.ASC);
};

const defaultCellRender = ({
    columnMetadata,
    getHeader,
    key,
    sortState,
    CellComponent
}) => {
    return (
        <CellComponent
            sortDirection={
                sortState.columnID === columnMetadata.id ? sortState.direction : false
            }
            key={key}
        >
            {sortState.isSortEnabled && sortState.isSortEnabled(columnMetadata) ? (
                <TableSortLabel
                    active={sortState.columnID === columnMetadata.id}
                    direction={
                        sortState.columnID === columnMetadata.id
                            ? sortState.direction
                            : DATA_GRID_SORT_DIRECTIONS.ASC
                    }
                    onClick={createSortHandler({
                        columnID: columnMetadata.id,
                        sortState
                    })}
                >
                    {getHeader()}
                </TableSortLabel>
            ) : (
                getHeader()
            )}
        </CellComponent>
    );
};

const MUITableHeader = props => {
    const { CellComponent = TableCell, customCellRender = defaultCellRender } = props;
    const {
        columnsMetadata,
        sortState
    } = React.useContext(DataGridContext);

    return (
        <TableHead>
            <TableRow>
                {columnsMetadata.map(columnMetadata =>
                    customCellRender({
                        columnMetadata,
                        sortState,
                        key: columnMetadata.id,
                        getHeader: () => columnMetadata.header,
                        CellComponent
                    })
                )}
            </TableRow>
        </TableHead>
    );
};

export default MUITableHeader;

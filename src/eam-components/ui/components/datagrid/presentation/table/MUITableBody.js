import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { DataGridContext } from "../..//DataGridContext";

const defaultCellRenderer = ({ columnMetadata, getDisplayValue, CellComponent }) => (
    <CellComponent align="left" key={columnMetadata.id}>
        {getDisplayValue()}
    </CellComponent>
);

const MUITableBody = props => {
    const { CellComponent = TableCell, cellRenderer = defaultCellRenderer } = props;
    const { rows, columnsMetadata, getDisplayValue } = React.useContext(
        DataGridContext
    );
    return (
        <TableBody>
            {rows &&
                rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columnsMetadata &&
                            columnsMetadata.map(
                                columnMetadata =>
                                    columnMetadata &&
                                    columnMetadata.id &&
                                    <React.Fragment key={columnMetadata.id + rowIndex}>
                                        {cellRenderer({
                                            row,
                                            columnMetadata,
                                            type: columnMetadata.type || {},
                                            getDisplayValue: () => getDisplayValue({ row, columnMetadata }),
                                            CellComponent
                                        })}
                                    </React.Fragment>
                            )}
                    </TableRow>
                ))}
        </TableBody>
    );
};

export default MUITableBody;

import React from "react";
import { DATA_GRID_SORT_TYPES, DATA_GRID_SORT_DIRECTIONS } from "./Constants";

export const DataGridContext = React.createContext();

const getDisplayValue = ({ row, columnMetadata }) =>
    columnMetadata.getDisplayValue ? columnMetadata.getDisplayValue({ row, columnMetadata }) : row[columnMetadata.id];

export const DataGridProvider = props => {
    const { rows, columnsMetadata, isSortEnabled, sortBy = {} } = props;
    const [columnID, setColumnID] = React.useState(sortBy.columnID);
    const [direction, setDirection] = React.useState(sortBy.direction || DATA_GRID_SORT_DIRECTIONS.ASC);

    let computedRows = rows;
    if (isSortEnabled && columnID) {
        computedRows = stableSort(rows, getComparator({
            columnMetadata: columnsMetadata.find(c => c.id === columnID),
            isSortEnabled,
            direction
        }))
    }

    const context = {
        getDisplayValue,
        sortState: {
            columnID,
            setColumnID,
            direction,
            setDirection,
            isSortEnabled
        },
        rows: computedRows,
        columnsMetadata,
    };

    return (
        <DataGridContext.Provider value={context}>
            {props.children}
        </DataGridContext.Provider>
    );
};

const descendingComparator = ({ a, b, property }) => {
    if (b[property] < a[property]) {
        return -1;
    }
    if (b[property] > a[property]) {
        return 1;
    }
    return 0;
};

const getDefaultComparator = ({ direction, property }) => (
    (a, b) => (direction === DATA_GRID_SORT_DIRECTIONS.DESC ? 1 : -1) * descendingComparator({ a, b, property })
)


const getNumericComparator = ({ direction, property }) => {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    return (a, b) => (direction === DATA_GRID_SORT_DIRECTIONS.DESC ? -1 : 1) * collator.compare(a[property], b[property]);
}

const getComparator = ({ columnMetadata, isSortEnabled, direction }) => {
    if (!isSortEnabled || !isSortEnabled(columnMetadata)) return;

    if (columnMetadata.comparator) {
        return columnMetadata.comparator({ direction, property: columnMetadata.id });
    }

    switch (columnMetadata.sortType) {
        case DATA_GRID_SORT_TYPES.NUMERIC:
            return getNumericComparator({ direction, property: columnMetadata.id })
        case DATA_GRID_SORT_TYPES.DEFAULT:
        default:
            return getDefaultComparator({ direction, property: columnMetadata.id })
    }
}

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};
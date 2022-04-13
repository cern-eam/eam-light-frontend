import React from "react";
import { Checkbox } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import { useFilters, useFlexLayout, useRowSelect, useSortBy, useTable } from "react-table";

const DefaultCheckbox = withStyles(() => ({
    root: {
        padding: 0
    }
}))(Checkbox);

const useSelectionCheckboxHook = (selectable) => (hooks) => hooks.visibleColumns.push(columns => {
    if (!selectable) return columns;
    return  columns.length ? [
        {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <DefaultCheckbox
                        color="primary"
                        style={{ display: 'table-cell' }}
                        {...getToggleAllRowsSelectedProps()}
                        />
                </div>
            ),
            Cell: ({ row }) => (
                <div>
                    <DefaultCheckbox
                        color="primary"
                        {...row.getToggleRowSelectedProps()}
                        />
                </div>
            ),
            Filter: null,
            filter: null,
            disableSortBy: true,
            width: '',
            minWidth: 0,
            maxWidth: 150,
        },
        ...columns
    ] : columns;
});

const useEAMGridTableInstance = (settings) => {
    const { selectable = false, ...useTableSettings } = settings;
    const tableInstance = useTable(
        useTableSettings,
        useFilters,
        useSortBy,
        useRowSelect,
        useFlexLayout,
        useSelectionCheckboxHook(selectable),
    );

    return tableInstance;
}

export default useEAMGridTableInstance;
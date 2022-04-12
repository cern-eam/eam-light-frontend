import React, { useCallback, useEffect, useRef } from "react";
import {
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    withStyles,
    Table,
    TableSortLabel,
    Typography,
} from "@material-ui/core";
import { CellMeasurer, CellMeasurerCache, List, AutoSizer } from "react-virtualized";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

const DefaultBodyCellComponent = withStyles((theme) => ({
    root: {
        overflow: 'hidden',
        borderRight: `1px solid ${theme.palette.grey[200]}`,
        borderTop:`1px solid ${theme.palette.grey[200]}`,
        borderBottom: 'none',
        padding: theme.spacing(1),
        wordBreak: 'break-word',
    }
}))(TableCell);

const DefaultHeadCellComponent = withStyles((theme) => ({
    root: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        background: theme.palette.grey[100],
    }
}))(DefaultBodyCellComponent);

const DefaultTableComponent = withStyles((theme) => ({
    root: {
        borderLeft: `1px solid ${theme.palette.grey[200]}`,
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }
}))(Table);

const DefaultTableSortLabel = withStyles((theme) => ({
    root: {
        position: "absolute",
        right: 0,
        '&:hover': {
            backgroundColor: theme.palette.grey[100]
        }
    },
    active: {
        backgroundColor: theme.palette.grey[100]
    },
}))(TableSortLabel);

const defaultPropsGetter = () => ({});

let _cache;
let _list;

const EAMGridMain = (props) => {
    const {
        loading,
        tableInstance,
        getRowProps = defaultPropsGetter,
        getCellProps = defaultPropsGetter,
        getColumnProps = defaultPropsGetter,
        TableComponent = DefaultTableComponent,
        BodyCellComponent = DefaultBodyCellComponent,
        HeadCellComponent = DefaultHeadCellComponent,
    } = props;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
    } = tableInstance;

    useEffect(() => {
        _cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 41,
            keyMapper: index => index
        });
    }, []);

    useEffect(() => {
        rows.forEach((_, i) => _cache.clear(i));
        if (_list) {
            _list && _list.recomputeRowHeights();
            _list.scrollToRow(0);
        }
    }, [rows]);

   const RenderRow = React.useCallback(
    ({ index, key, parent, style, isScrolling }) => {
        const row = rows[index]
        prepareRow(row)
        const customRowProps = getRowProps(row);

        const tableRowProps = row.getRowProps({
            ...customRowProps,
            style: {
                ...style,
                ...customRowProps.style
            }
        })

        return (
            <CellMeasurer
                cache={_cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}
            >
                {({measure}) => (
                <TableRow className="tr" component="div" {...tableRowProps} >
                    {row.cells.map((cell) => {
                        const cellProps = [
                            { style: { maxWidth: cell.column.maxWidth, width: cell.column.width }},
                            getCellProps(cell),
                        ].filter(Boolean);
                        return (
                            <BodyCellComponent {...cell.getCellProps(cellProps)} className="td" component="div">
                                {cell.render("Cell")}
                            </BodyCellComponent>
                        )
                    }
                    )}
                </TableRow>
                )}
            </CellMeasurer>
        )},
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getCellProps, getRowProps, prepareRow, rows, selectedFlatRows, _cache]
    )

    const noResults = !rows.length && !loading;

    return (
        <TableContainer style={{ height: '100%', overflowY: 'hidden', overflowX: noResults ? 'auto' : 'hidden' }}>
            <ScrollSync>
                <TableComponent stickyHeader {...getTableProps({ style: { height: '100%' } })} component="div">
                    <ScrollSyncPane group="horizontal">
                        <TableHead style={{ display: noResults ? 'flex' : 'grid', overflow: 'hidden', overflowY: 'scroll' }} component="div">
                            {headerGroups.map((headerGroup) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()} component="div">
                                    {headerGroup.headers.map((column) => {
                                        const headerProps = [
                                            { style: { maxWidth: column.maxWidth, width: column.width }},
                                            getColumnProps(column),
                                        ].filter(Boolean)
                                        return (
                                            <HeadCellComponent key={column.id} {...column.getHeaderProps(headerProps)} component="div">
                                                <div {...column.getSortByToggleProps({ title: 'Toggle Sort By' })}>
                                                    {column.render("Header")}
                                                    {column.id !== 'selection' ? (
                                                        <DefaultTableSortLabel
                                                            active={column.isSorted}
                                                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                                                        />
                                                        ) : null}
                                                </div>
                                                {column.id !== 'selection' &&
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}>{column.canFilter ? column.render('Filter') : null}</div>
                                                }
                                            </HeadCellComponent>
                                        )
                                    }
                                    )}
                                </TableRow>
                            ))}
                        </TableHead>
                    </ScrollSyncPane>
                    <TableBody {...getTableBodyProps()} style={{ height: '100%', display: 'table-row' }} component="div">
                    {!rows.length && !loading ? 
                        <div style={{ width: "100%", position: "absolute", display: "flex", flexDirection: "column", padding: "1rem" }}>
                            <Typography variant="body2" color="textSecondary">No records to show</Typography>
                        </div>
                    :
                        <div style={{ display: 'block', height: '100%' }}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <ScrollSyncPane group="horizontal">
                                        <List
                                            ref={element => {
                                                _list = element;
                                            }}
                                            style={{ overflowX: 'scroll', overflowY: 'scroll', willChange: 'scroll-position' }}
                                            deferredMeasurementCache={_cache}
                                            overscanRowCount={10}
                                            rowCount={rows.length}
                                            rowHeight={_cache.rowHeight}
                                            rowRenderer={RenderRow}
                                            width={width}
                                            height={height}
                                        />
                                    </ScrollSyncPane>
                                )}
                            </AutoSizer>
                        </div>
                    }
                    </TableBody>
                </TableComponent>
            </ScrollSync>
        </TableContainer>
    )
}

export default EAMGridMain;

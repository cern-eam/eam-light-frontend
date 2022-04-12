import Axios from "axios";
import React, {
    useState,
    createContext,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import GridWS from "../../eamgrid/lib/GridWS";
import { EAMCellField, EAMFilterField, getRowAsAnObject } from "./utils";
import useEAMGridTableInstance from "./useEAMGridTableInstance";
import { useAsyncDebounce } from "react-table";

const defaultCreateColumns = ({ gridField, cellRenderer }) =>
    (gridField || [])
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
            id: field.name,
            Header: field.label,
            accessor: field.name,
            width: Number(field.width),
            minWidth: 0,
            maxWidth: 99999,
            dataType: field.dataType,
            Filter: EAMFilterField,
            Cell: cellRenderer ? cellRenderer : EAMCellField,
        }));

const processFilters = (filters, filterProcessor) => {
    return filters
        .map((f) => {
            const filter = f.value;
            const allowedFilter = Object.keys(filter)
                .filter((key) =>
                    ["fieldName", "fieldValue", "joiner", "operator"].includes(
                        key
                    )
                )
                .reduce(
                    (newFilterObj, key) => ({
                        ...newFilterObj,
                        [key]: filter[key],
                    }),
                    {}
                );
            return allowedFilter;
        })
        .filter(
            (filter) =>
                filter.fieldValue !== undefined ||
                filter.fieldValue !== "" ||
                ["IS EMPTY", "NOT EMPTY"].includes(filter.operator)
        )
        .map(filterProcessor);
};

const processSortBy = (sortBy, sortByProcessor) =>
    (sortBy || [])
        .map((sort) => ({
            sortBy: sort.id,
            sortType: sort.desc === true ? "DESC" : "ASC",
        }))
        .map(sortByProcessor);

const hasCustomFieldColumn = (columns) => {
    return columns
        .map(({ id }) => id.toLowerCase())
        .some(
            (id) =>
                id.startsWith("c_") &&
                ["_evnt", "_obj", "_part"].some((ending) => id.endsWith(ending))
        );
};

export const EAMGridContext = createContext();

export const EAMGridContextProvider = (props) => {
    const {
        gridName,
        userFunctionName,
        gridID,
        useNative = true,
        initialRowsPerPage,
        initialFilters,
        initialDataspyID,
        initialSortBy = [],
        tableInstanceProps,
        onChangeSelectedRows,
        onChangeFilters,
        onChangeSortBy,
        onChangePage,
        onChangeRowsPerPage,
        onChangeDataspy,
        searchOnMount,
        cellRenderer,
        handleError,
        createColumns,
        dataCallback,
        processData,
        sortByProcessor = (e) => e,
        filterProcessor = (e) => e,
    } = props;
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedDataspy, setSelectedDataspy] = useState(undefined);
    const [disableFilters, setDisableFilters] = useState(false);
    const [dataspies, setDataspies] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage || 50);
    const [loading, setLoading] = useState(false);
    const [gridResult, setGridResult] = useState({});
    const [gridField, setGridField] = useState();

    const resetFilters = useMemo(
        () =>
            (initialFilters || []).map((filter) => ({
                id: filter.fieldName,
                value: filter,
            })),
        [initialFilters]
    );
    const [gridRequest, setGridRequest] = useState({
        gridName,
        userFunctionName: userFunctionName ?? gridName,
        gridID,
        useNative,
        dataspyID: initialDataspyID || null,
        countTotal: true,
        includeMetadata: true,
        rowCount: rowsPerPage,
        gridSort: processSortBy(initialSortBy, sortByProcessor),
        gridFilter: processFilters(resetFilters, filterProcessor),
    });
    const [fetchDataCancelToken, setFetchDataCancelToken] = useState();
    const [loadingExportToCSV, setLoadingExportToCSV] = useState(false);
    const columnCreator = createColumns ?? defaultCreateColumns;
    const dataCreator = processData ?? (({ data: d }) => d);

    const columns = useMemo(
        () => columnCreator({ gridField, cellRenderer }),
        [gridField, cellRenderer, columnCreator]
    );
    const data = useMemo(
        () =>
            dataCreator({
                data: (gridResult?.row || []).map(getRowAsAnObject),
            }),
        [gridResult.row]
    );

    const hasUnkownTotalRecords = useMemo(
        () => (gridResult?.records ?? "").includes("+"),
        [gridResult]
    );
    const recordsNumber = +(gridResult?.records ?? "").replace("+", "");
    const totalRecords =
        recordsNumber <= rowsPerPage ? data.length : recordsNumber;

    const tableInstance = useEAMGridTableInstance({
        columns,
        data,
        initialState: {
            filters: resetFilters,
            sortBy: initialSortBy,
        },
        manualFilters: true,
        manualSortBy: true,
        disableMultiSort: true,
        disableFilters: disableFilters,
        autoResetSortBy: false,
        autoResetFilters: false,
        autoResetSelectedRows: false,
        ...tableInstanceProps,
    });

    const {
        state: { sortBy, filters },
        selectedFlatRows,
        prepareRow,
    } = tableInstance;

    const toggleFilters = useCallback(
        () => setDisableFilters(!disableFilters),
        [disableFilters, setDisableFilters]
    );

    useEffect(() => {
        dataCallback && dataCallback({ data });
    }, [data]);

    useEffect(() => {
        fetchDataDebounced({
            ...gridRequest,
            rowCount: searchOnMount ? rowsPerPage : 0,
        });
        return () => {
            if (fetchDataCancelToken) {
                fetchDataCancelToken.cancel();
            }
        };
    }, []);

    const fetchData = useCallback(
        (gr) => {
            setLoading(true);
            if (fetchDataCancelToken) {
                fetchDataCancelToken.cancel();
            }
            const newFetchDataCancelToken = Axios.CancelToken.source();
            setFetchDataCancelToken(newFetchDataCancelToken);
            GridWS.getGridData(gr, {
                cancelToken: newFetchDataCancelToken.token,
            })
                .then((response) => {
                    const newGridResult = response.body.data;
                    if (gr.includeMetadata) {
                        const dataspy = newGridResult.gridDataspy.find(
                            (ds) => ds.code === newGridResult.dataSpyId
                        );
                        setDataspies(newGridResult.gridDataspy);
                        setSelectedDataspy(dataspy);
                        setGridField(newGridResult.gridField);
                    }
                    setGridResult(newGridResult);
                    setLoading(false);
                })
                .catch((error) => {
                    handleError && handleError(error);
                });
        },
        [fetchDataCancelToken, setFetchDataCancelToken]
    );

    const fetchDataDebounced = useAsyncDebounce(fetchData, 100);

    const handleOnSearch = useCallback(() => {
        setPageIndex(0);
        const newGridRequest = {
            ...gridRequest,
            cursorPosition: 0,
        };
        setGridRequest(newGridRequest);
        tableInstance.toggleAllRowsSelected(false);
        fetchDataDebounced(newGridRequest);
    }, [tableInstance, fetchDataDebounced, gridRequest]);

    const handleExportToCSV = useCallback(() => {
        setLoadingExportToCSV(true);
        return GridWS.exportDataToCSV(gridRequest)
            .then((result) => {
                const hiddenElement = document.createElement("a");
                // utf8BOM used to enable detection of utf-8 encoding by excel when opening the CSV file
                const utf8BOM = "\uFEFF";
                hiddenElement.href =
                    "data:text/csv;charset=UTF-8," +
                    encodeURI(`${utf8BOM}${result.body}`).replaceAll(
                        "#",
                        "%23"
                    );
                hiddenElement.target = "_blank";
                hiddenElement.download = `exported_data.csv`;
                hiddenElement.click();
            })
            .finally(() => {
                setLoadingExportToCSV(false);
            });
    }, [gridRequest]);

    useEffect(() => {
        const newGridFilters = processFilters(filters, filterProcessor);
        if (
            JSON.stringify(newGridFilters) ===
            JSON.stringify(gridRequest.gridFilter)
        )
            return;
        setGridRequest({
            ...gridRequest,
            gridFilter: newGridFilters,
            cursorPosition: 0,
        });
        onChangeFilters && onChangeFilters(newGridFilters);
    }, [filters, gridRequest, onChangeFilters, tableInstance]);

    useEffect(() => {
        const newGridSort = processSortBy(sortBy, sortByProcessor);
        if (
            JSON.stringify(newGridSort) ===
                JSON.stringify(gridRequest.gridSort) ||
            (!newGridSort.length && !gridRequest.gridSort)
        )
            return;
        const newGridRequest = {
            ...gridRequest,
            gridSort: newGridSort,
            cursorPosition: 0,
        };
        setPageIndex(0);
        setGridRequest(newGridRequest);
        fetchDataDebounced(newGridRequest);
        onChangeSortBy && onChangeSortBy(sortBy);
    }, [
        sortBy,
        gridRequest,
        onChangeSortBy,
        fetchDataDebounced,
        tableInstance,
    ]);

    const handleChangePage = useCallback(
        (page) => {
            setPageIndex(page);
            const newCursorPosition = page * rowsPerPage + 1;
            if (
                newCursorPosition === gridRequest.cursorPosition &&
                gridRequest.rowCount === rowsPerPage
            )
                return;
            const newGridRequest = {
                ...gridRequest,
                cursorPosition: newCursorPosition,
            };
            tableInstance.toggleAllRowsSelected(false);
            setGridRequest(newGridRequest);
            fetchDataDebounced(newGridRequest);
            onChangePage && onChangePage(page);
        },
        [
            fetchDataDebounced,
            gridRequest,
            rowsPerPage,
            tableInstance,
            onChangePage,
        ]
    );

    const handleChangeRowsPerPage = useCallback(
        (perPage) => {
            setPageIndex(0);
            setRowsPerPage(perPage);
            const newGridRequest = {
                ...gridRequest,
                cursorPosition: 0,
                rowCount: perPage,
            };
            tableInstance.toggleAllRowsSelected(false);
            setGridRequest(newGridRequest);
            fetchDataDebounced(newGridRequest);
            onChangeRowsPerPage && onChangeRowsPerPage(perPage);
        },
        [fetchDataDebounced, gridRequest, tableInstance, onChangeRowsPerPage]
    );

    const handleDataspyChange = useCallback(
        (dataspy) => {
            if (!dataspy) return;
            setSelectedDataspy(dataspy);
            const newGridRequest = {
                ...gridRequest,
                gridFilter: [],
                gridSort: [],
                dataspyID: dataspy?.code,
                includeMetadata: true,
            };
            tableInstance.toggleAllRowsSelected(false);
            tableInstance.setAllFilters([]);
            tableInstance.setSortBy([]);
            setGridRequest(newGridRequest);
            fetchDataDebounced(newGridRequest);
            onChangeDataspy && onChangeDataspy(dataspy);
        },
        [
            fetchDataDebounced,
            gridRequest,
            resetFilters,
            tableInstance,
            onChangeDataspy,
        ]
    );

    const handleResetFilters = useCallback(() => {
        tableInstance.setAllFilters([]);
    }, [resetFilters, tableInstance]);

    useEffect(() => {
        if (onChangeSelectedRows) {
            selectedFlatRows.forEach(prepareRow);
            onChangeSelectedRows(selectedFlatRows);
        }
    }, [selectedFlatRows, onChangeSelectedRows]);

    useEffect(() => {
        if (columns.length > 0 && !hasCustomFieldColumn(columns)) {
            setGridRequest({
                ...gridRequest,
                includeMetadata: false,
            });
        }
    }, [columns]);

    const context = {
        columns,
        data,
        dataspies,
        disableFilters,
        loading,
        pageIndex,
        selectedDataspy,
        rowsPerPage,
        setDataspies,
        setDisableFilters,
        setLoading,
        setPageIndex,
        setSelectedDataspy,
        setRowsPerPage,
        handleOnSearch,
        toggleFilters,
        tableInstance,
        handleChangePage,
        handleChangeRowsPerPage,
        handleDataspyChange,
        hasUnkownTotalRecords,
        totalRecords,
        initialFilters,
        handleResetFilters,
        handleExportToCSV,
        loadingExportToCSV,
    };

    return (
        <EAMGridContext.Provider value={context}>
            {props.children}
        </EAMGridContext.Provider>
    );
};

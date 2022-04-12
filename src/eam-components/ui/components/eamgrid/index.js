import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataGridResultTable from './components/table/EAMGridTable';
import DataGridSelectDataspy from './components/EAMGridSelectDataspy';
import GridWS from "./lib/GridWS";
import {toggleSortField} from './lib/sorting';
import {clearFilters, saveGridRequestInLocalStorage, loadGridRequestFromLocalStorage, setFilter, getFilters} from './lib/filtering';
import ErrorTypes from "./lib/GridErrorTypes";
import axios from "axios/index";
import withStyles from '@mui/styles/withStyles';
import KeyCode from "./enums/KeyCode";
import HttpStatus from "./enums/HttpStatus";

const styles = {
    dataGridMainContainer: {
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box"
    }
};

export const initialGridRequest = {
    rowCount: 50,
    cursorPosition: 1,
    gridSort: [],
    gridFilter: [],
    useNative: true,
    includeMetadata: true
}

class EAMGrid extends Component {

    /*
    Map containing all filters
    filterMap is updated on every keystroke. Filters are applied when the user actually executes the search.
    */
    state = {
        hasMore: true,
        totalRecords: 0,
        rows: []    ,
        selectedRows: {},
        isloading: true,
        gridRequest: {},
        exporterBlocked: false,
        filterVisible: this.props.filterVisible
    };

    filterMap = null;

    fieldsWidthInfo = new Map();

    toggleSortField = toggleSortField.bind(this);

    setFilter = setFilter.bind(this);

    getFilters = getFilters.bind(this);

    clearFilters = clearFilters.bind(this);


    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        document.body.onkeydown = e => this.handleKeyDown(e);
        this.init(this.props);
    }

    componentWillReceiveProps (nextProps) {
        if ((nextProps.gridId && nextProps.gridId !== this.props.gridId) ||
            (nextProps.screenCode && nextProps.screenCode !== this.props.screenCode)) {
            this.init(nextProps)
        }
    }

    componentDidUpdate (prevProps) {
        if (this.props.gridId !== prevProps.gridId
                || this.props.screenCode !== prevProps.screenCode
                || this.props.dataspyId !== prevProps.dataspyId) {
            this.init(this.props);
        }
    }

    componentWillUnmount() {
        !!this.cancelSource && this.cancelSource.cancel && this.cancelSource.cancel();
        this.props.onRef && this.props.onRef(undefined);
    }

    init = props => {
        if (props.gridId || props.screenCode) {
            this._initGrid({
                ...initialGridRequest,
                rowCount: props.searchOnMount ? initialGridRequest.rowCount : 0,
                gridID: props.gridId,
                dataspyID: props.dataspyId || null,
                gridName: props.screenCode,
                userFunctionName: props.screenCode,
                gridSort: props.gridSort || [],
                ...(props.initialGridFilters ? {gridFilter: props.initialGridFilters} : {}),
            })
        }
    }


    /**
     * To be called only when the Grid changes (GRID ID)
     */
    _initGrid = (gridRequest) => {
        // clean filter by removing filters without value
        let request = this.props.gridRequestAdapter(gridRequest);
        if (!this.filterMap) {
            this.filterMap = this.props.initialGridFilters ?
                this.props.initialGridFilters.reduce((acc, filter) => {acc[filter.fieldName] = filter; return acc}, {})
                : {}
                ;
        }

        this.setState({
            isloading: true,
            rows: []
        },
            () => GridWS.getGridData(request)
                .then(data => {
                    const metadata = data.body.data;

                    if (gridRequest.includeMetadata) {
                        this._resetFieldWidthInfo(metadata.gridField)

                        // sort field based on their order
                        this._orderGridFieldsBasedOnTheirOrderProperty(metadata.gridField);
                    }

                    // set metadata info in state
                    this.setState({
                        fields: metadata.gridField,
                        listOfDataSpy: metadata.gridDataspy,
                        hasMore: metadata.moreRowsPresent === 'TRUE',
                        totalRecords: metadata.records,
                        rows: metadata.row,
                        isloading: false,
                        gridRequest: {
                            ...gridRequest,
                            gridID: metadata.gridCode,
                            dataspyID: metadata.dataSpyId,
                            gridName: metadata.gridName,
                            userFunctionName: metadata.gridName,
                            cursorPosition: metadata.cursorPosition + 1,
                            includeMetadata: false
                        }
                    });
                }).catch(error => {
                    this.setState({
                        isloading: false,
                        gridRequest: {
                            ...gridRequest
                        }
                    })
                if (error.status === HttpStatus.NOT_FOUND) {
                    alert("Metadata for this grid does not exist");
                }
            })
        );

    };

    getCellWidth = cellTagname => this.fieldsWidthInfo.get(cellTagname)

    handleChangeDataSpy (event) {
        this._initGrid({
            ...this.state.gridRequest,
            includeMetadata: true,
            cursorPosition: 1,
            dataspyID: event.target.value,
            gridSort: [],
            gridFilter: []
        });
    };

    toggleFilter () {
        this.setState(prevState => ({
            filterVisible: !prevState.filterVisible
        }))
    };

    // Execute search
    runSearch () {
        // Run search, update state with latest state of filters
        let filters = this.getFilters();

        if (this.props.setSearchFilters) {
            this.props.setSearchFilters(filters);
        }

        this.setState(prevState => ({
            hasMore: true,
            rows: [],
            totalRecords: 0,
            gridRequest: {
                ...prevState.gridRequest,
                rowCount: initialGridRequest.rowCount,
                gridFilter: filters,
                cursorPosition: 1
            },
            selectedRows: {}
        }), () => {
            this.loadMoreData();
        })
    };

    _cleanFilters = () => {
        // clean filter by removing filters without value
        let request = {
            ...this.state.gridRequest,
            gridFilter: Object.values(this.filterMap)
        };
        request.gridFilter = request.gridFilter.filter(f => f.operator !== 'INDETERMINATE' && ((f.fieldValue && f.fieldValue !== "") || f.operator === 'SELECTED' || f.operator === 'NOT_SELECTED'|| f.operator === 'IS EMPTY' || f.operator === 'NOT EMPTY'));
        return request;
    };

    loadMoreData () {
        // cancel current transaction if any
        if (!!this.cancelSource) {
            this.cancelSource.cancel();
        }

        // return if no results have to be returned
        if (!this.state.hasMore) {
            return;
        }

        // get axios token to allow transaction cancellation
        this.cancelSource = axios.CancelToken.source();

        this.setState(prevState => ({
                ...prevState,
                isloading: true
            }), () => {

                // clean filter by removing filters without value
                let request = this.props.gridRequestAdapter(this._cleanFilters());

                GridWS.getGridData(request, {
                    cancelToken: this.cancelSource.token
                }).then(data => {
                    // nullify info of current transaction
                    this.cancelSource = null;

                    // set state with data and grid fields info
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            isloading: false,
                            data: data.body.data,
                            hasMore: data.body.data.moreRowsPresent === 'TRUE',
                            totalRecords: data.body.data.records,
                            rows: prevState.rows.concat(data.body.data.row),
                            gridRequest: {
                                ...prevState.gridRequest,
                                cursorPosition: data.body.data.cursorPosition + 1,
                            }
                        }
                    });
                }).catch(error => {
                    if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                        this.setState({
                            isloading: false
                        });

                        this.props.handleError(error);
                    }
                });
            }
        )
    };

    exportDataToCSV () {
        this.setState({exporterBlocked: true});

        // get axios token to allow transaction cancellation
        this.cancelSource = axios.CancelToken.source();

        // clean filter by removing filters without value
        let request = this.props.gridRequestAdapter(this._cleanFilters());

        return GridWS.exportDataToCSV(request, {
            cancelToken: this.cancelSource.token
        }).then(data => {
            // nullify info of current transaction
            this.cancelSource = null;

            this.setState({exporterBlocked: false});

            return data.body;
        }).catch(error => {
            if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                this.setState({
                    exporterBlocked: false
                });
                this.props.handleError(error);
            }
        });
    };

    handleSelectRow = (row, checked) => {
        this.setState((prevState) => {
            const selectedRows = {...prevState.selectedRows};
            if (checked && this.props.isRowSelectable(row, selectedRows)) {
                selectedRows[row.id] = row;
            } else {
                delete selectedRows[row.id];
            }
            //If the row is selected and there is the function
            if (this.props.onSelectRow)
                this.props.onSelectRow(row, checked, selectedRows);
            return {selectedRows};
        });
    };


    _orderGridFieldsBasedOnTheirOrderProperty(fields) {
        fields.sort((a, b) => +a.order - +b.order);
    }

    _isHidden(tagName) {
        const { hiddenTags } = this.props;
        return hiddenTags && hiddenTags.some(f => f === tagName)
    }

    _resetFieldWidthInfo(fields) {
        this.fieldsWidthInfo = new Map();
        fields.map(field => this.fieldsWidthInfo.set(field.name, {
            width: field.width,
            dataType: field.dataType
        }));
    }


    handleKeyDown(event) {
        if (event.key === KeyCode.F7) {
            this.toggleFilter();
        } else if (event.key === KeyCode.F8) {
            this.runSearch();
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.dataGridMainContainer}
                 style={{
                     height: `calc(100% - ${this.state.filterVisible ? this.props.heightFilterVisible : this.props.heightFilterNotVisible})`,
                     width: `${this.props.width}`
                 }}>
                {
                    this.props.showDataspySelection &&
                    <DataGridSelectDataspy
                        dataSpy={this.state.gridRequest.dataspyID || ''}
                        listOfDataSpy={this.state.listOfDataSpy}
                        handleChangeDataSpy={this.handleChangeDataSpy.bind(this)}
                        toggleFilter={this.toggleFilter.bind(this)}
                        filterVisible={this.state.filterVisible}
                        runSearch={this.runSearch.bind(this)}
                        clearFilters={this.clearFilters.bind(this)}
                    />
                }
                <DataGridResultTable
                    toggleSortField={this.toggleSortField.bind(this)}
                    getCellWidth={this.getCellWidth.bind(this)}
                    fields={this.state.fields}
                    rows={this.state.rows}
                    loadMoreData={this.loadMoreData.bind(this)}
                    exportData={this.exportDataToCSV.bind(this)}
                    hasMore={this.state.hasMore}
                    isloading={this.state.isloading}
                    filterVisible={this.state.filterVisible}
                    filters={this.state.gridRequest.gridFilter}
                    sortFields={this.state.gridRequest.gridSort}
                    setFilter={this.setFilter}
                    runSearch={this.runSearch.bind(this)}
                    totalRecords={this.state.totalRecords}
                    cellRenderer={this.props.cellRenderer}
                    exporterBlocked={this.state.exporterBlocked}
                    isHiddenField={this._isHidden.bind(this)}
                    onSelectRow={this.props.onSelectRow}
                    onEditRow={this.props.onEditRow}
                    onUnselectAll={this.props.onUnselectAll}
                    isRowSelectable={this.props.isRowSelectable}
                    extraColumns={this.props.extraColumns}
                    onRowClick={this.props.onRowClick}
                    allowRowSelection={this.props.allowRowSelection}
                    handleSelectRow={this.handleSelectRow}
                    selectedRows={this.state.selectedRows}
                    headerStyle={this.props.headerStyle}
                    rowStyler={this.props.rowStyler}
                />
            </div>
        );
    }
}

EAMGrid.propTypes = {
    gridId: PropTypes.string.isRequired,
    showDataspySelection: PropTypes.bool,
    cache: PropTypes.bool,
    selectColumn: PropTypes.bool,
    autorun: PropTypes.bool,
    editColumn: PropTypes.bool,
    gridRequestAdapter: PropTypes.func,
    extraColumns: PropTypes.array,
    language: PropTypes.string,
    onRowClick: PropTypes.func,
    allowRowSelection: PropTypes.bool,
    rowStyler: PropTypes.func,
    filterVisible: PropTypes.bool
};

EAMGrid.defaultProps = {
    cache: true,
    showDataspySelection: true,
    selectColumn: false,
    editColumn: false,
    autorun: true,
    gridRequestAdapter: gridRequest => gridRequest,
    heightFilterVisible: '128px',
    heightFilterNotVisible: '97px',
    width: '100%',
    extraColumns: [],
    language: 'EN',
    allowRowSelection: false,
    headerStyle: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },
    filterVisible: true,
    searchOnMount: true,
};

export default withStyles(styles)(EAMGrid);
import React, {Component} from 'react';
import DataGridTableHeader from './EAMGridHeader';
import DataGridTableBody from './EAMGridBody';
import DataGridLoadingSpinner from '../EAMGridLoadingSpinner';
import DataGridFooter from './EAMGridFooter';
import withStyles from '@mui/styles/withStyles';
import DataGridActions from './EAMGridActions';

const styles = {
    searchresults: {
        height: '100%',
        backgroundColor: 'white',
        overflowY: 'auto',
        border: '1px solid lightGray'
    },
    tableHeaderWrapper: {
        overflowX: 'hidden',
        borderLeft: '1px solid #d3d3d3',
        borderRight: '1px solid #d3d3d3',
        backgroundColor: '#fafafa'
    },
    headerStyle: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    }
};

class DataGridResultTable extends Component {

    _handleScroll(event) {
        if (event.target.id === 'searchresults') {
            this.tableHeader.scrollLeft = event.target.scrollLeft;
            // add scroll bar in header if the results have a scroll bar
            // in order to keep the irght margin to right
            if (event.target.clientHeight < event.target.scrollHeight) {
                this.tableHeader.style.overflowY = 'scroll';
            } else {
                this.tableHeader.style.overflowY = 'visible';
            }
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div style={{flex: "1 0", minHeight: 0}}>

                <DataGridActions
                    selectButtons={this.props.allowRowSelection}
                    onUnselectAll={() => {
                        this.tableBody.unselectAll();
                    }}
                    onSelectAll={() => {
                        this.tableBody.selectAll();
                    }}
                />

                {
                    this.props.fields &&
                    <div id="tableHeaderWrapper"
                         className={classes.tableHeaderWrapper}
                         ref={(tableHeader) => {
                             this.tableHeader = tableHeader;
                         }}>
                        <DataGridTableHeader fields={this.props.fields}
                                             toggleSortField={this.props.toggleSortField}
                                             filterVisible={this.props.filterVisible}
                                             filters={this.props.filters}
                                             sortFields={this.props.sortFields}
                                             setFilter={this.props.setFilter}
                                             runSearch={this.props.runSearch}
                                             isHiddenField={this.props.isHiddenField}
                                             selectColumn={this.props.allowRowSelection}
                                             editColumn={this.props.onEditRow !== undefined}
                                             extraColumns={this.props.extraColumns}
                                             headerStyle={classes.headerStyle}
                        />
                    </div>
                }

                <div id="searchresults"
                     className={classes.searchresults}
                     style={{'display': 'flex', 'flexDirection': 'column'}}
                     ref={(searchresults) => {
                         this.searchresults = searchresults;
                     }}
                     onScroll={this._handleScroll.bind(this)}>

                    {
                        this.props.rows.length > 0 ?
                            <DataGridTableBody fields={this.props.fields}
                                               rows={this.props.rows}
                                               refCallback={(tableBody) => {
                                                   this.tableBody = tableBody;
                                               }}
                                               getCellWidth={this.props.getCellWidth}
                                               loadMoreData={this.props.loadMoreData.bind(this)}
                                               hasMore={this.props.hasMore}
                                               parentScroll={this.searchresults}
                                               isloading={this.props.isloading}
                                               cellRenderer={this.props.cellRenderer}
                                               isHiddenField={this.props.isHiddenField}
                                               onSelectRow={this.props.onSelectRow}
                                               onEditRow={this.props.onEditRow}
                                               isRowSelectable={this.props.isRowSelectable}
                                               extraColumns={this.props.extraColumns}
                                               onRowClick={this.props.onRowClick}
                                               allowRowSelection={this.props.allowRowSelection}
                                               handleSelectRow={this.props.handleSelectRow}
                                               selectedRows={this.props.selectedRows}
                                               rowStyler={this.props.rowStyler}
                            />
                            : (
                                this.props.hasMore ?
                                    <DataGridLoadingSpinner isloading={this.props.isloading}/> :
                                    <div
                                        style={{width: "100%", padding: "20px", fontWeight: "bold", textAlign: "center"}}>No
                                        result found</div>
                            )
                    }
                </div>

                {
                    this.props.fields &&
                    <DataGridFooter
                        rows={this.props.rows}
                        totalRecords={this.props.totalRecords}
                        exportData={this.props.exportData}
                        exporterBlocked={this.props.exporterBlocked}
                    />
                }

            </div>
        );
    }
}

export default withStyles(styles)(DataGridResultTable);
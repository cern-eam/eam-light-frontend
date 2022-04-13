import React, {Component} from 'react';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import DataGridFilter from './header-filter/EAMGridFilter';
import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';
import EAMGridHeaderCell from './EAMGridHeaderCell';

const styles = {
    tableHeader: {
        width: "100%",
        display: "flex",
        flex: "0 0 auto",
        fontWeight: "bold",
        fontSize: "14px"
    },
    headerCellContainer: {
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #d3d3d3",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
        overflow: "hidden",
        paddingBottom: 10,
        paddingTop: 5
    },
    headerCell: {
        width: "100%",
        minHeight: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#a5a5a5",
        paddingLeft: "5px",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box"
    },
    arrowicon: {
        width: "12px",
        height: "24px",
        fontWeight: "bold"
    }
};

class DataGridTableHeader extends Component {

    _getFilteredField(fieldname) {
        let fieldFilter = this.props.filters.filter(f => f.fieldName === fieldname);

        if (fieldFilter.length === 0) {
            return {
                fieldName: fieldname,
                fieldValue: '',
                operator: 'BEGINS'
            }
        } else
            return fieldFilter[0];
    }

    _getSortedField(fieldname) {
        let fieldSorting = this.props.sortFields.filter(s => s.sortBy === fieldname);

        if (fieldSorting.length === 0) {
            return {
                sortBy: fieldname,
                sortType: undefined
            }
        } else
            return fieldSorting[0];
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.tableHeader}>

                {this.props.selectColumn &&
                    <EAMGridHeaderCell>
                        <Tooltip title="Choose">
                            <div className={this.props.headerStyle}>
                                Choose
                            </div>
                        </Tooltip>
                    </EAMGridHeaderCell>
                }

                {this.props.editColumn &&
                    <EAMGridHeaderCell>
                        <Tooltip title="Edit">
                            <div className={this.props.headerStyle}>
                                Edit
                            </div>
                        </Tooltip>
                    </EAMGridHeaderCell>
                }

                {this.props.extraColumns && this.props.extraColumns.filter(extraColumn => extraColumn.position !== 'after').map((extraColumn, index) => (
                    <EAMGridHeaderCell key={index} style={{'width': extraColumn.width || '20px', 'minWidth': extraColumn.width || '20px'}}>
                        { extraColumn.headerLabel }
                    </EAMGridHeaderCell>
                ))}

                {
                    this.props.fields && this.props.fields.map((field) => {
                        const fieldsorting = this._getSortedField(field.name);

                        return field.order > 0 &&
                            !this.props.isHiddenField(field.name) && (
                                <div key={field.id}
                                     className={classes.headerCellContainer}
                                     style={{'width': `${field.width}px`, 'minWidth': `${field.width}px`}}>

                                    <div className={classes.headerCell}
                                         onClick={() => {
                                             this.props.toggleSortField({
                                                 'sortBy': field.name
                                             })
                                         }}
                                    >
                                        <div title={field.label} className={this.props.headerStyle}>
                                            {field.label}
                                        </div>
                                        <div className={classes.arrowicon}>
                                            {
                                                fieldsorting.sortType === 'DESC' &&
                                                <ArrowDownward className={classes.arrowicon}/>
                                            }
                                            {
                                                fieldsorting.sortType === 'ASC' &&
                                                <ArrowUpward className={classes.arrowicon}/>
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.props.filterVisible &&
                                        <DataGridFilter key={`filter-${field.id}`}
                                                        filter={this._getFilteredField(field.name)}
                                                        setFilter={this.props.setFilter}
                                                        runSearch={this.props.runSearch}
                                                        width={field.width}
                                                        dataType={field.dataType}
                                        />
                                    }

                                </div>
                            )
                    })
                }

                {this.props.extraColumns && this.props.extraColumns.filter(extraColumn => extraColumn.position === 'after').map((extraColumn,index) => (
                    <EAMGridHeaderCell key={index} style={{'width': extraColumn.width || '20px', 'minWidth': extraColumn.width || '20px'}}>
                        { extraColumn.headerLabel }
                    </EAMGridHeaderCell>
                ))}
            </div>
        );
    }
}

export default withStyles(styles)(DataGridTableHeader);
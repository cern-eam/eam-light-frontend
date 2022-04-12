import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import DataGridLoadingSpinner from '../EAMGridLoadingSpinner';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core/styles/index";
import Edit from "@material-ui/icons/Edit";
import classNames from "classnames";
import EAMGridCell from "./EAMGridCell";

const styles = {
    searchRow: {
        wordBreak: "break-all",
        wordWrap: "break-word",
        color: "black",
        minWidth: "100%",
        backgroundColor: "white",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "left",
        borderBottom: "1px solid #ebebeb",
        '&:hover': {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    searchRowOdd: {
        backgroundColor: "#fafafa"
    },
    searchRowEven: {},
    searchRowCell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        borderRight: "1px solid #d3d3d3",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
        width: "100px",
        minWidth: "100px"
    },
    searchRowCellContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
        padding: "5px"
    }
};

class DataGridTableBody extends Component {


    constructor(props) {
        super(props);
        this.props.refCallback(this);
    }

    _toggleCheckbox = (row, checked) => {
        this._toggleCheckboxes([row], checked);
    };

    _toggleCheckboxes = (rows, checked) => {
        for (let row of rows) {
            this.props.handleSelectRow(row, checked);
        }
    };

    // Click on "Select All"
    selectAll = () => {
        this._toggleCheckboxes(this.props.rows, true);
    };

    // Click on "Unselect All"
    unselectAll = () => {
        this._toggleCheckboxes(this.props.rows, false);
    };

    _onRowClick = row => event => {
        if (this.props.onRowClick) {
            this.props.onRowClick(row);
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div id="tableResults">

                <InfiniteScroll
                    style={{'overflow': 'visible'}}
                    next={this.props.loadMoreData}
                    hasMore={this.props.hasMore}
                    height={this.props.height}
                    scrollableTarget={this.props.parentScroll}
                    loader={<DataGridLoadingSpinner isloading={this.props.isloading}/>}>

                    {
                        this.props.rows && this.props.rows.map((row, index) => {
                            return <div key={row.id}
                                        className={classNames(classes.searchRow, classes[`searchRow${index % 2 ? 'Odd' : 'Even'}`])}
                                        style={this.props.rowStyler ? this.props.rowStyler(row) : {}}
                                        onClick={this._onRowClick(row)}>

                                {this.props.allowRowSelection &&
                                <EAMGridCell>
                                    <Checkbox
                                        style={{width:'inherit',height:'inherit'}}
                                        checked={this.props.selectedRows[row.id] !== undefined}
                                        disabled={this.props.isRowSelectable && !this.props.isRowSelectable(row, this.props.selectedRows)}
                                        onChange={(event) => this._toggleCheckbox(row, event.target.checked)}/>
                                </EAMGridCell>
                                }

                                {this.props.onEditRow &&
                                <EAMGridCell>
                                    <Edit color="primary" onClick={() => this.props.onEditRow(row)}
                                          style={{"cursor": "pointer"}}/>
                                </EAMGridCell>
                                }

                                {this.props.extraColumns && this.props.extraColumns.filter(extraColumn => extraColumn.position !== 'after').map((extraColumn, index) => (
                                    <EAMGridCell key={index} style={{
                                        'width': extraColumn.width || '20px',
                                        'minWidth': extraColumn.width || '20px'
                                    }}>
                                        {this.props.cellRenderer && this.props.cellRenderer(extraColumn, row)}
                                    </EAMGridCell>
                                ))}

                                {row.cell.map((cell) =>
                                    (
                                        cell.order > 0 &&
                                        !this.props.isHiddenField(cell.t) &&
                                        this.props.getCellWidth(cell.t) && (

                                            <div key={cell.n}
                                                 className={classes.searchRowCell}
                                                 style={{
                                                     'width': `${this.props.getCellWidth(cell.t).width}px`,
                                                     'minWidth': `${this.props.getCellWidth(cell.t).width}px`
                                                 }}>
                                                <div className={classes.searchRowCellContent}>

                                                    {
                                                        (this.props.cellRenderer && this.props.cellRenderer(cell, row))
                                                        ||
                                                        (
                                                            this.props.getCellWidth(cell.t).dataType === 'CHKBOOLEAN' ?
                                                                <div style={{
                                                                    justifyContent: "space-evenly",
                                                                    display: "flex",
                                                                    width: "100%"
                                                                }}>
                                                                    {
                                                                        cell.value === 'true' ?
                                                                            <CheckBox style={{
                                                                                color: grey[600],
                                                                                width: '20px',
                                                                                marginTop: '-3px'
                                                                            }}/>
                                                                            :
                                                                            <CheckBoxOutlineBlank style={{
                                                                                color: grey[600],
                                                                                width: '20px',
                                                                                marginTop: '-3px'
                                                                            }}/>
                                                                    }
                                                                </div>
                                                                :
                                                                <Typography style={{
                                                                    width: `calc(${this.props.getCellWidth(cell.t).width}px - 10px)`,
                                                                    color: 'inherit',
                                                                    //fontWeight: 'inherit'
                                                                }}>
                                                                    {cell.value}
                                                                </Typography>
                                                        )
                                                    }

                                                </div>
                                            </div>

                                        )
                                    )
                                )}

                                {this.props.extraColumns && this.props.extraColumns.filter(extraColumn => extraColumn.position === 'after').map((extraColumn, index) => (
                                    <EAMGridCell key={index} style={{
                                        'width': extraColumn.width || '20px',
                                        'minWidth': extraColumn.width || '20px'
                                    }}>
                                        {this.props.cellRenderer && this.props.cellRenderer(extraColumn, row)}
                                    </EAMGridCell>
                                ))}
                            </div>
                        })
                    }

                </InfiniteScroll>

            </div>
        );
    }
}

export default withStyles(styles)(DataGridTableBody);
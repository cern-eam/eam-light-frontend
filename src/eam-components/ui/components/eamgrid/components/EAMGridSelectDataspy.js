import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import {InputBase, MenuItem} from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FilterOutline from 'mdi-material-ui/FilterOutline';
import FilterRemoveOutline from 'mdi-material-ui/FilterRemoveOutline';

const styles = {
    mainPanelStyle: {
        backgroundColor: '#fafafa',
        padding: '10px',
        border: '1px solid lightGray'
    },
    formStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dataspyFormStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    fetchDataButton: {
        padding: "4px 16px"
    },
    toggleFilterButton: {
        marginLeft: "10px",
        marginRight: "10px",
        boxShadow: "none",
        backgroundColor: '#fafafa'
    },
    formItem: {
        flex: "0 0 auto"
    },
    selectDataspyInput: {
        backgroundColor: '#fafafa',
        marginLeft: "10px",
    },
    dataspyLabel: {
        marginTop: -2,
        fontSize: 16
    },
    root: {
        margin: "0 auto",
        width: "100%"
    },
    '@media (max-width: 500px)' : {
        cleanFiltersButton: {
           display: "none"
        },
        dataspyLabel: {
            display: "none"
        }
    }
};

class DataGridSelectDataSpy extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.mainPanelStyle}>
                <form>
                    <FormControl className={classes.root}>
                        <div className={classes.formStyle}>
                            <div className={classes.dataspyFormStyle}>
                                <div className={classNames(classes.formItem, classes.dataspyLabel)}>
                                    Dataspy:
                                </div>
                                <Select className={classNames(classes.formItem, classes.selectDataspyInput)}
                                    value={this.props.dataSpy}
                                    onChange={this.props.handleChangeDataSpy}
                                    inputProps={{
                                        name: 'dataspy',
                                        id: 'dataspy-select',
                                    }}
                                    input={<InputBase/>}
                                >
                                    {
                                        this.props.listOfDataSpy && this.props.listOfDataSpy.map((dataspy) => {
                                            return <MenuItem key={dataspy.code} value={dataspy.code}>{dataspy.label}</MenuItem>
                                        })
                                    }
                                </Select>
                                <Button variant="outlined"
                                        className={classNames(classes.formItem, classes.toggleFilterButton)}
                                        onClick = {this.props.toggleFilter}>
                                    { this.props.filterVisible ? 'HIDE FILTERS' : 'SHOW FILTERS' }
                                 </Button>
                                {this.props.filterVisible && (
                                <Button
                                    variant="outlined"
                                    className={classes.cleanFiltersButton}
                                    onClick={this.props.clearFilters}>
                                    Clean filters
                                </Button>
                                )}
                            </div>
                            <Button variant="outlined"
                                    color="primary"
                                    className={classes.fetchDataButton}
                                    onClick = {this.props.runSearch}>
                                <SearchIcon />
                                SEARCH
                            </Button>
                        </div>
                    </FormControl>
                </form>
        </div>
        );
    }
}

export default withStyles(styles)(DataGridSelectDataSpy);
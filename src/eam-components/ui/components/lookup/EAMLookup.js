import React from 'react';
import {Search} from '@material-ui/icons';
import {Dialog, DialogContent, withStyles} from '@material-ui/core';
import EAMGrid from '../eamgrid';
import {handleError} from '../actions/uiActions';
import PropTypes from 'prop-types';

const styles = {
    root: {
        padding: 0,
        paddingTop: "0px !important"
    }
};

class EAMLookup extends React.Component {

    state = {
        open: false
    };

    iconButtonStyle = {
        position: "absolute",
        top: this.props.top || 30,
        right: this.props.right || -2,
        backgroundColor: "transparent",
        width: this.props.width || 32,
        height: this.props.height || 32,
        zIndex: 1,
        cursor: "pointer",
        color: '#8c8c8c'
    };

    openDialog = () => {
        this.setState(() => ({
            open: true
        }));

        if (this.props.value) {
            setTimeout(() => {
                this.grid.setFilter({
                    fieldName: this.props.keys.code,
                    fieldValue: this.props.value,
                    operator: "BEGINS"
                });

                this.grid.runSearch();
            }, 100)
        }
    };

    closeDialog = () => {
        this.setState(() => ({
            open: false
        }));
    };

    onRowClick = (row) => {
        let code = row.cell.filter(cell => cell.t === this.props.keys.code);
        let desc = row.cell.filter(cell => cell.t === this.props.keys.desc);

        if (code.length === 1) {
            code = code[0].value;
        }

        if (desc.length === 1) {
            desc = desc[0].value;
        }

        if (this.props.keys.mapCodeTo) {
            this.props.updateProperty(this.props.keys.mapCodeTo, code);
        } else {
            this.props.updateProperty(this.props.keys.code, code);
        }

        if (this.props.keys.mapDescTo) {
            this.props.updateProperty(this.props.keys.mapDescTo, desc);
        } else if (this.props.keys.desc) {
            this.props.updateProperty(this.props.keys.desc, code);
        }

        this.setState(() => ({
            open: false
        }));
    };

    render() {
        //Check disabled
        if (this.props.disabled) {
            return this.props.children;
        }
        //Render component normally
        return (
            <div style={{position: "relative"}}>
                {this.props.children}
                <Search style={this.iconButtonStyle} onClick={this.openDialog}/>

                <Dialog
                    open={this.state.open}
                    onClose={this.closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    height={500}
                    maxWidth={'md'}
                    classes={this.props.classes}
                >
                    <DialogContent classes={this.props.classes}>
                        <div style={{height: "85vh", maxHeight: 650, marginBottom: -30, overflowY: "hidden"}}>
                            <EAMGrid
                                gridId={this.props.gridId}
                                autorun
                                gridRequestAdapter={this.props.gridRequestAdapter}
                                onRowClick={this.onRowClick}
                                onRef={ref => this.grid = ref}
                                cache={false}
                                handleError={handleError}
                                filterVisible={this.props.filterVisible}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

EAMLookup.propTypes = {
    filterVisible: PropTypes.bool
};

EAMLookup.defaultProps = {
    filterVisible: true
};

export default withStyles(styles)(EAMLookup);
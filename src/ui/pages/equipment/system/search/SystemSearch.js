import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default class SystemSearch extends Component {

    _cellRenderer(cell) {
        if( cell.t === 'equipmentno') {
            return (
                <Typography>
                    <Link to={"/system/" + cell.value}>
                        { cell.value }
                    </Link>
                </Typography>
            )
        }
        return false;
    }

    render() {
        return (
            <div className="entityContainer">
                <EAMGrid
                    gridId={this.props.systemScreen.gridId}
                    screenCode={this.props.systemScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                />
            </div>
        )
    }
}
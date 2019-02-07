import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default class WorkorderSearch extends Component {

    _cellRenderer(cell) {
        if( cell.t === 'workordernum') {
            return (
                <Typography>
                    <Link to={"/workorder/" + cell.value}>
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
                    gridId={this.props.workOrderScreen.gridId}
                    screenCode={this.props.workOrderScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                />
            </div>
        )
    }
}
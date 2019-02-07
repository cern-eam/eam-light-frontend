import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default class PositionSearch extends Component {

    _cellRenderer(cell) {
        if( cell.t === 'equipmentno') {
            return (
                <Typography>
                    <Link to={"/position/" + cell.value}>
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
                    gridId={this.props.positionScreen.gridId}
                    screenCode={this.props.positionScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                />
            </div>
        )
    }
}
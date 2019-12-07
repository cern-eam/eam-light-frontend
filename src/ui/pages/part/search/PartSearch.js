import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default class PartSearch extends Component {

    _cellRenderer(cell) {
        if( cell.t === 'partcode') {
            return (
                <Typography>
                    <Link to={"/part/" + cell.value}>
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
                    gridId={this.props.partScreen.gridId}
                    screenCode={this.props.partScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                />
            </div>
        )
    }
}
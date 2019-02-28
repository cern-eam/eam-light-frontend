import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default class AssetSearch extends Component {

    _cellRenderer(cell) {
        if( cell.t === 'equipmentno') {
            return (
                <Typography>
                    <Link to={"/asset/" + cell.value}>
                        { cell.value }
                    </Link>
                </Typography>
            )
        }
        return false;
    }

    gridRequestAdapter = gridRequest => {
       return {
            ...gridRequest,
            useNative: false
        }
    };

    render() {
        return (
            <div className="entityContainer">
                <EAMGrid
                    gridId={this.props.assetScreen.gridId}
                    screenCode={this.props.assetScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                    gridRequestAdapter={this.gridRequestAdapter}
                />
            </div>
        )
    }
}
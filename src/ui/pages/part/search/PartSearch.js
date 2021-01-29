import React, {Component} from 'react';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import GridTools from '../../../../tools/GridTools';

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
        const filters = GridTools.parseGridFilters(GridTools.getURLParameterByName('gridFilters'));
        const setSearchFilters = (gridFilters) => {
            const params = GridTools.replaceUrlParam('gridFilters', GridTools.stringifyGridFilters(gridFilters));
            this.props.history.push(params);
        }


        return (
            <div className="entityContainer">
                <EAMGrid
                    gridId={this.props.partScreen.gridId}
                    screenCode={this.props.partScreen.screenCode}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                    searchOnMount={this.props.partScreen.startupAction !== "N"}
                    initialGridFilters={filters}
                    setSearchFilters={setSearchFilters}
                />
            </div>
        )
    }
}
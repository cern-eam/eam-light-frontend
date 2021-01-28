import EAMGrid from "eam-components/dist/ui/components/eamgrid";
import queryString from "query-string";
import React from 'react';
import { Link } from 'react-router-dom';
import GridTools from '../../../tools/GridTools';
import Typography from '@material-ui/core/Typography';

const treatParamAsList = (param) => (param === undefined || param === null) ? []
    : Array.isArray(param) ? param
    : param.includes(",") ? param.split(",")
    : [param]


const cellRenderer = ({assetColumns, workorderColumns, locationColumns, partColumns}) => (cell, row) => {
    return treatParamAsList(assetColumns).includes(cell.t)  ?
            getLink("/equipment/", cell.value)
        : treatParamAsList(locationColumns).includes(cell.t)  ?
            getLink("/location/", cell.value)
        : treatParamAsList(workorderColumns).includes(cell.t)  ?
            getLink("/workorder/", cell.value)
        : treatParamAsList(partColumns).includes(cell.t)  ?
            getLink("/part/", cell.value)
        : ["equipmentno", "obj_code", "evt_object", , "equipment"].includes(cell.t) ?
            getLink("/equipment/", cell.value)
        : ["location"].includes(cell.t) ?
            getLink("/location/", cell.value)
        : ["workordernum", "evt_code", "parentwo"].includes(cell.t) ?
            getLink("/workorder/", cell.value)
        : ["part"].includes(cell.t) ?
            getLink("/part/", cell.value)
        : null
        ;
}

const getLink = (path, val) => <Typography>
        <Link to={path + encodeURIComponent(val)}>
            {val}
        </Link>
    </Typography>


function Grid(props) {
    const filters = GridTools.parseGridFilters(GridTools.getURLParameterByName('gridFilters'));

    const values = queryString.parse(window.location.search);
    return (
        <div className="entityContainer">
            <EAMGrid
                screenCode={values.gridName}
                cellRenderer={cellRenderer(values)}
                initialGridFilters={filters}
            />
        </div>
    )
}

export default Grid;
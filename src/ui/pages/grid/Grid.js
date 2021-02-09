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


const cellRenderer = userColumns => (cell, row) => {
    const userColumnToType = {
        assetColumns: 'equipment',
        locationColumns: 'location',
        workorderColumns: 'workorder',
        partColumns: 'part',
    };

    const typeToDefaultColumns = {
        equipment: ['equipmentno', 'obj_code', 'evt_object', 'equipment'],
        location: ['location'],
        workorder: ['workordernum', 'evt_code', 'parentwo'],
        part: ['part'],
    }

    const link = userColumnToType[Object.keys(userColumnToType)
                .find(userColumn => treatParamAsList(userColumns[userColumn]).includes(cell.t))]
            || Object.keys(typeToDefaultColumns)
                .find(type => typeToDefaultColumns[type].includes(cell.t));

    return link === undefined ? null : getLink(`/${link}/`, cell.value);
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
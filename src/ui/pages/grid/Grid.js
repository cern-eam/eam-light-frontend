import React from 'react';
import queryString from "query-string";
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import SyncedQueryParamsEAMGridContext from "../../../tools/SyncedQueryParamsEAMGridContext";
import EAMGrid from 'eam-components/ui/components/grids/eam/EAMGrid';
import { EAMCellField } from 'eam-components/ui/components/grids/eam/utils';


const treatParamAsList = (param) => (param === undefined || param === null) ? []
    : Array.isArray(param) ? param
    : param.includes(",") ? param.split(",")
    : [param]


const cellRenderer = userColumns => ({ column, value }) => {
    const userColumnToType = {
        equipmentColumns: 'equipment',
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
                .find(userColumn => treatParamAsList(userColumns[userColumn]).includes(column.id))]
            || Object.keys(typeToDefaultColumns)
                .find(type => typeToDefaultColumns[type].includes(column.id));

    return link === undefined ? EAMCellField({ column, value }) : getLink(`/${link}/`, value);
}

const getLink = (path, val) => <Typography>
        <Link to={path + encodeURIComponent(val)}>
            {val}
        </Link>
    </Typography>


const Grid = () => {
    const values = queryString.parse(window.location.search);
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={values.gridName}
            cellRenderer={cellRenderer(values)}
            searchOnMount
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    )

}

export default Grid;
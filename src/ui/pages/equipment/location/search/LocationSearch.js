import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import EAMGrid from 'eam-components/ui/components/grids/eam/EAMGrid';
import { EAMCellField } from 'eam-components/ui/components/grids/eam/utils';
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";

const cellRenderer = ({ column, value }) => {
    if (column.id === 'equipmentno') {
        return (
            <Typography>
                <Link to={"/location/" + value}>
                    {value}
                </Link>
            </Typography>
        )   
    }
    return EAMCellField({ column, value });
}

const LocationSearch = (props) => {
    const { locationScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={locationScreen.screenCode}
            handleError={handleError}
            searchOnMount={locationScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            key={locationScreen.screenCode}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default LocationSearch;

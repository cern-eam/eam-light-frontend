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
                <Link to={"/position/" + value}>
                    {value}
                </Link>
            </Typography>
        )   
    }
    return EAMCellField({ column, value });
}

const PositionSearch = (props) => {
    const { positionScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={positionScreen.screenCode}
            handleError={handleError}
            searchOnMount={positionScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            key={positionScreen.screenCode}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default PositionSearch;

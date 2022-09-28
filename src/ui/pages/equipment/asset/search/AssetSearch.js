import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import EAMGrid from 'eam-components/dist/ui/components/grids/eam/EAMGrid';
import { EAMCellField } from 'eam-components/dist/ui/components/grids/eam/utils';
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";

const cellRenderer = ({ column, value, row }) => {
    if (column.id === 'equipmentno') {
        return (
            <Typography>
                <Link to={"/asset/" + value + (row.values.organization ? '%23' + row.values.organization : '')}>
                    {value}
                </Link>
            </Typography>
        )   
    }
    return EAMCellField({ column, value });
}

const AssetSearch = (props) => {
    const { assetScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={assetScreen.screenCode}
            handleError={handleError}
            searchOnMount={assetScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            key={assetScreen.screenCode}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default AssetSearch;

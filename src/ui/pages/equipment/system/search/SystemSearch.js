import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import EAMGrid from 'eam-components/ui/components/grids/eam/EAMGrid';
import { EAMCellField } from 'eam-components/ui/components/grids/eam/utils';
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";

const cellRenderer = ({ column, value }) => {
    if (column.id === 'equipmentno') {
        return (
            <Typography>
                <Link to={"/system/" + value}>
                    {value}
                </Link>
            </Typography>
        )   
    }
    return EAMCellField({ column, value });
}

const SystemSearch = (props) => {
    const { systemScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={systemScreen.screenCode}
            handleError={handleError}
            searchOnMount={systemScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            keyName={systemScreen.screenCode}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default SystemSearch;

import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { EAMCellField } from 'eam-components/dist/ui/components/grids/eam/utils';
import EAMGrid from 'eam-components/dist/ui/components/grids/eam/EAMGrid';
import SyncedQueryParamsEAMGridContext from "../../../../tools/SyncedQueryParamsEAMGridContext";


const iconRenderer = ({ column, value }) => {
    const [name, color] = value.split('@')
    const baseUrl = 'https://cmmsx-test.cern.ch/web/base/resources/theme-default/images/gis/map-pin-'

    if(!color || !color.length) {
        return EAMCellField({ column, value });
    }

    const iconUrl = `${baseUrl}${color.toLowerCase().trim()}.svg`

    return (
        <>
            <img
                src={iconUrl}
                alt={value}
                style={{
                    height: '1rem',
                    position: 'relative',
                    top: '2px'
                }}
            />
            {name}
        </>
    )
}

const cellRenderer = ({ column, value }) => {
    if (column.id === 'statusicon' || column.id === 'priorityicon') {
        return iconRenderer({ column, value });
    }

    if (column.id === 'workordernum') {
        return (
            <Typography>
                <Link to={"/workorder/" + value}>
                    {value}
                </Link>
            </Typography>
        )
    }

    return EAMCellField({ column, value });
}

const WorkorderSearch = (props) => {
    const { workOrderScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={workOrderScreen.screenCode}
            handleError={handleError}
            searchOnMount={workOrderScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
        >
            <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default WorkorderSearch;

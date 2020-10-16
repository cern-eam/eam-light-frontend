import React from 'react'
import RegionPanel from './regionpanel/RegionPanel';
import Grid from '@material-ui/core/Grid';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from "query-string"

const ENTITY_REGION_PARAMS = {
    MAXIMIZE: 'maximize'
}

const EntityRegions = (props) => {
    const { isHiddenRegion, regions = [], showEqpTree, isNewEntity } = props;
    const [visibleRegions, setVisibleRegions] = React.useState([]);
    const [regionMaximized, setRegionMaximized] = React.useState(undefined);

    const history = useHistory();
    const location = useLocation();
    const searchParams = queryString.parse(location.search);

    React.useEffect(() => {
        const defaultVisibility = (region) => regionMaximized === region.id ||
            (!isHiddenRegion(region.id) && (region.customVisibility ? region.customVisibility() : true));

        setVisibleRegions(regions.reduce((acc, region) => ({
            ...acc,
            [region.id]: isNewEntity
                ? region.isVisibleWhenNewEntity && defaultVisibility(region)
                : defaultVisibility(region)
        }), {}))
    }, [regions, isHiddenRegion, isNewEntity, regionMaximized])

    React.useEffect(() => {
        setRegionMaximized(searchParams.maximize);
    }, [searchParams[ENTITY_REGION_PARAMS.MAXIMIZE]])

    const columns = regions.reduce((acc, region) => ({
        ...acc,
        [region.column]: [
            ...(acc[region.column] || []),
            region
        ]
    }), {});

    const gridDimensions = {
        xs: 12,
        sm: 12,
        md: showEqpTree || regionMaximized ? 12 : 12 / Object.keys(columns).length,
        lg: regionMaximized ? 12 : 12 / Object.keys(columns).length,
    }

    const updateMaximize = (regionID) => () => {
        const newSearchParams = regionID ? (
            { ...searchParams, maximize: regionID }
        ) : (
            Object.keys(searchParams)
                .filter(paramKey => paramKey !== ENTITY_REGION_PARAMS.MAXIMIZE)
                .reduce((acc, paramKey) => ({
                    ...acc,
                    [paramKey]: searchParams[paramKey]
                }), {})
        )
        history.push({
            pathname: location.pathname,
            search: queryString.stringify(newSearchParams)
        });
        setRegionMaximized(regionID);
    }

    const getRegionPanelQueryParams = React.useCallback((regionID) => Object.keys(searchParams)
        .filter(paramKey => paramKey.startsWith(regionID))
        .reduce((acc, paramKey) => ({
            ...acc,
            [paramKey.replace(`${regionID}_`, '')]: searchParams[paramKey],
        }), {})
    , [searchParams]);

    return (
        <div id="entityContent">
            <Grid container spacing={1}>
                {Object.keys(columns).sort().map(column => (
                    <Grid key={column} item xs={gridDimensions.xs} sm={gridDimensions.sm} md={gridDimensions.md} lg={gridDimensions.lg}>
                        {columns[column]
                            .sort((a,b) => a.id === regionMaximized ? -1 : a.order - b.order)
                            .filter(region => visibleRegions[region.id])
                            .map(region => (
                                <RegionPanel
                                    style={{ display: regionMaximized && region.id !== regionMaximized ? 'none' : '' }}
                                    key={region.id}
                                    heading={region.label.toUpperCase()}
                                    isMaximized={region.id === regionMaximized}
                                    maximize={updateMaximize(region.id)}
                                    unMaximize={updateMaximize(undefined)}
                                    showMaximizeControls={region.maximizable}
                                    {...region.RegionPanelProps}>
                                    {region.render({ panelQueryParams: getRegionPanelQueryParams(region.id) })}
                                </RegionPanel>
                            ))
                        }
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

export default EntityRegions;

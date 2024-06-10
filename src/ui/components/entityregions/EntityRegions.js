import React from 'react'
import RegionPanel from './regionpanel/RegionPanel';
import Grid from '@mui/material/Grid';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from "query-string"
import { styled } from '@mui/material/styles';

const ENTITY_REGION_PARAMS = {
    MAXIMIZE: 'maximize',
    VISIBLE: 'visible'
}

const styleSummaryIcon = (SummaryIcon) => styled(SummaryIcon)(({theme}) => ({
    '&': {
        marginRight: 8, 
        marginLeft: 3,
        color: theme.palette.primary.main,
        //backgroundColor: theme.palette.primary.extraLight
        backgroundColor: 'transparent'
    }
}))

const EntityRegions = (props) => {
    const { isHiddenRegion, regions : inputRegions = [], showEqpTree, isNewEntity, setRegionVisibility, getHiddenRegionState, getUniqueRegionID } = props;
    const [visibleRegions, setVisibleRegions] = React.useState([]);
    const [regionMaximized, setRegionMaximized] = React.useState(undefined);

    const regions = inputRegions.filter(region => !region.ignore);

    const history = useHistory();
    const location = useLocation();

    const searchParams = queryString.parse(location.search, {arrayFormat: 'comma'});
    const visibleRegionsParam =  searchParams[ENTITY_REGION_PARAMS.VISIBLE] ? 
        [].concat(searchParams[ENTITY_REGION_PARAMS.VISIBLE]) : [];

    const expandedRegion = searchParams.expanded;
    
    React.useEffect(() => {
        regions.filter(region => getHiddenRegionState(region.id) === undefined)
            .forEach(region => setRegionVisibility(getUniqueRegionID(region.id), region.initialVisibility))
    }, [inputRegions, isHiddenRegion, getHiddenRegionState, setRegionVisibility, getUniqueRegionID]);

    React.useEffect(() => {
        const defaultVisibility = (region) => expandedRegion === region.id || regionMaximized === region.id ||
            visibleRegionsParam.includes(region.id) ||
            !visibleRegionsParam.length && !isHiddenRegion(region.id) && (region.customVisibility ? region.customVisibility() : true);

        setVisibleRegions(regions.reduce((acc, region) => ({
            ...acc,
            [region.id]: isNewEntity
                ? region.isVisibleWhenNewEntity && defaultVisibility(region)
                : defaultVisibility(region)
        }), {}))
    }, [inputRegions, isHiddenRegion, isNewEntity, regionMaximized])

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
            search: queryString.stringify(newSearchParams, {arrayFormat: 'comma'})
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
                                    summaryIcon={region.summaryIcon && styleSummaryIcon(region.summaryIcon)}
                                    isMaximized={region.id === regionMaximized}
                                    maximize={updateMaximize(region.id)}
                                    unMaximize={updateMaximize(undefined)}
                                    showMaximizeControls={region.maximizable}
                                    initiallyExpanded={expandedRegion === undefined || expandedRegion === region.id}
                                    {...region.RegionPanelProps}>
                                    {region.render({ panelQueryParams: getRegionPanelQueryParams(region.id), isMaximized: region.id === regionMaximized })}
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

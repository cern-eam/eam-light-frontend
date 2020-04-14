import React from 'react'
import RegionPanel from './regionpanel/RegionPanel';
import Grid from '@material-ui/core/Grid';
import { useHistory, useLocation } from 'react-router-dom';

const EntityRegions = (props) => {
    const { isHiddenRegion, regions = [], showEqpTree, isNewEntity } = props;
    const [visibleRegions, setVisibleRegions] = React.useState([]);
    const [regionMaximized, setRegionMaximized] = React.useState(undefined);

    const history = useHistory();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

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
        setRegionMaximized(searchParams.get('maximize'));
    }, [searchParams])

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
        md: showEqpTree ? 12 : 12 / Object.keys(columns).length,
        lg: 12 / Object.keys(columns).length,
    }

    const updateMaximize = (regionID) => () => {
        regionID
        ? searchParams.set('maximize', regionID)
        : searchParams.delete('maximize');
        history.push({ pathname: location.pathname, search: searchParams.toString()});
        setRegionMaximized(regionID);
    }

    return (
        <div id="entityContent">
            <Grid container spacing={1}>
                {Object.keys(columns).sort().map(column => (
                    <Grid key={column} item xs={gridDimensions.xs} sm={gridDimensions.sm} md={gridDimensions.md} lg={gridDimensions.lg}>
                        {columns[column]
                            .sort((a,b) => a.order - b.order)
                            .filter(region => visibleRegions[region.id])
                            .map(region => (
                                <RegionPanel
                                    key={region.id}
                                    heading={region.label.toUpperCase()}
                                    isMaximized={region.id === regionMaximized}
                                    maximize={updateMaximize(region.id)}
                                    unMaximize={updateMaximize(undefined)}
                                    showMaximizeControls={region.maximizable}
                                    {...region.RegionPanelProps}>
                                    {region.render()}
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

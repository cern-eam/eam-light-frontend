import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import FilterIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import React, { createRef, useCallback, useEffect, useMemo, useState } from "react";

import DataspyAutocompleteInput from "./DataspyAutocompleteInput";

const ContainerGrid = withStyles((theme) => ({
    root: {
        padding: "8px",
        background: theme.palette.grey[100],
        border: `1px solid ${theme.palette.grey[200]}`,
        borderBottom: "none",
        borderRadius: "4px 4px 0px 0px",
    },
}))(Grid);

const useStyles = makeStyles((theme) => ({
    dataspyChip: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
  }));

const EAMGridHead = ({
    loading,
    selectedDataspy,
    dataspies,
    onSearch,
    disableFilters,
    toggleFilters,
    onDataspyChange,
    onResetFilters,
}) => {
    const classes = useStyles();
    const showDataspyChips = useMemo(() => dataspies.length < 4, [dataspies]);

    return (
        <Box padding="0.5rem">
            <Grid
                container
                spacing={1}
                direction="row"
                alignItems="center">
                <Grid item xs={12} sm={12} md={showDataspyChips ? 7 : 5}>
                        {showDataspyChips ?
                            <Box display="flex" alignItems="center">
                                {dataspies.length ? <Typography variant="body2" color="textSecondary">Dataspy:</Typography> : null}
                                <Box className={classes.dataspyChip}>
                                    {dataspies.filter(Boolean).map((dataspy, i) => 
                                        <Chip
                                        key={dataspy.code}
                                        size="small"
                                        label={dataspy.label}
                                        color={dataspy.code === selectedDataspy?.code ? "primary" : "default" }
                                        onClick={() => onDataspyChange(dataspy)}
                                        />
                                    )}
                                </Box>
                            </Box>
                        : 
                            <Box>
                                <Autocomplete
                                    autoHighlight
                                    filterSelectedOptions
                                    loading={loading}
                                    value={selectedDataspy || {}}
                                    options={[selectedDataspy || {}, ...dataspies].filter(Boolean)}
                                    disableClearable
                                    isOptionEqualToValue={(option, value) => value.code === option.code}
                                    getOptionLabel={(dataspy) => dataspy.label || ""}
                                    renderInput={(params) => DataspyAutocompleteInput(loading, params)}
                                    onChange={(e, newDataspy) => onDataspyChange(newDataspy)}
                                />
                            </Box>
                        }
                </Grid>
                <Grid item xs={12} sm={12} md={showDataspyChips ? 5 : 7}>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        wrap="nowrap"
                        >
                        <Grid item>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={toggleFilters}
                                startIcon={<FilterIcon />}
                                >
                                {disableFilters ? "Show Filters" : "Hide Filters"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={onResetFilters}
                                >
                                Reset Filters
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={onSearch}
                                >
                                <SearchIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EAMGridHead;

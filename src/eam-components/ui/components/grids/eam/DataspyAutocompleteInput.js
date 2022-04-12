import { CircularProgress, TextField, withStyles } from "@material-ui/core";
import React from "react";

const Progress = withStyles({
    root: {
        marginLeft: 4,
    },
})(CircularProgress);

const DataspyAutocompleteInput = (loading, params) => (
    <TextField
        {...params}
        label="Dataspy"
        margin="dense"
        variant="outlined"
        size="small"
        InputLabelProps={{ shrink: true }}
        InputProps={{
            ...params.InputProps,
            startAdornment: (
                <>
                    {loading && <Progress size={20} />}
                    {params.InputProps.startAdornment}
                </>
            ),
        }}
    />
);

export default DataspyAutocompleteInput;

import React, { useEffect, useState } from "react";
import { AMMMultiAutocomplete, reactSelectComponents } from "amm-tools";
import { CircularProgress, Divider, IconButton, Paper, Typography } from "@material-ui/core"
import { Account, Close } from 'mdi-material-ui';
import WS from '../../../tools/WS';

const UserOption = (props) => {
    const { data } = props;

    return (
        <reactSelectComponents.Option {...props}>
            <Typography variant="body1" color="textSecondary">
                {data.usercode} {data.description}
            </Typography>
        </reactSelectComponents.Option>
    )
}

const getAutocompleteOptions = async ({ hint }) => {
    const result = await WS.autocompleteUsers(hint);
    return result.body.data;
};

const Watchlist = (props) => {
    const { addUserToWatchlist, isLoading, removeUserFromWatchlist, watchers } = props;
    
    const filterOptions = (candidate) => {
        if (watchers?.find((watcherCode) => watcherCode === candidate.value)) return false;
        return candidate.data.isactive;
    };

    return (
        <>
            <Paper elevation={3} style={{ maxHeight: 200, margin: '5px', padding: '3px', overflowY: "scroll" }}>
                {isLoading ?
                    <div style={{ display: 'flex', justifyContent: 'center', height: '60px' }}>
                        <CircularProgress />
                    </div> : 
                    watchers?.map((watcher) =>
                        <>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Account />
                                <Typography variant="subtitle2" color="textPrimary">{watcher.description}</Typography>
                                <IconButton onClick={() => removeUserFromWatchlist(watcher.usercode)} size='small' style={{ marginLeft: 'auto' }}>
                                    <Close />
                                </IconButton>
                            </div>
                            <Divider />
                        </>
                    )
                }
            </Paper>
            <AMMMultiAutocomplete
                loadOptions={getAutocompleteOptions}
                getOptionValue={(option) => option.usercode}
                getOptionLabel={(option) => option.description}
                components={{
                    Option: UserOption,
                }}
                onChange={addUserToWatchlist}
                autoSelectSingle={false}
                value={null}
                filterOption={filterOptions}
            />
        </>
    )
}

export default Watchlist;
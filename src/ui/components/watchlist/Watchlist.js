import React from "react";
import { AMMSingleAutocomplete, reactSelectComponents } from "amm-tools";
import { CircularProgress, IconButton, Paper, Typography } from "@material-ui/core"
import EAMFormLabel from "eam-components/dist/ui/components/inputs/EAMFormLabel";
import { Account, Delete } from 'mdi-material-ui';
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
        if (watchers?.find((watcherCode) => watcherCode.userCode === candidate.value)) return false;
        return candidate.data.isactive;
    };

    return (
        <>
            <EAMFormLabel label="Current Watchers" labelStyle={{fontWeight: 'normal', marginTop: '0.3rem'}} />
            <Paper 
                style={{
                    boxShadow: '0 0 0 1px hsla(0,0%,0%,0.1),0 4px 11px hsla(0,0%,0%,0.1)',
                    height: 125,
                    marginTop: '5px', 
                    marginBottom: '10px', 
                    padding: '3px', 
                    overflowY: "auto" 
                }}
            >
                {watchers?.length > 0 
                    ? (isLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center', height: '60px' }}>
                            <CircularProgress />
                        </div> : 
                        watchers.map((watcher) =>
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ebebeb' }}>
                                    <Account />
                                    <Typography variant="subtitle2" color="textPrimary">{watcher.userDesc.toUpperCase()}</Typography>
                                    <IconButton onClick={() => removeUserFromWatchlist(watcher.userCode)} size='small' style={{ marginLeft: 'auto' }}>
                                        <Delete />
                                    </IconButton>
                                </div>
                            </>
                        )
                    ) 
                    : (
                        <div style={{display: 'flex', justifyContent: "center", alignItems: 'center', height: '100%'}}>
                            <Typography color='textSecondary'><i>No watchers.</i></Typography>
                        </div>
                    )
                }
            </Paper>

            <EAMFormLabel label="Add Watchers" labelStyle={{fontWeight: 'normal', marginTop: '0.3rem'}} />
            <AMMSingleAutocomplete
                loadOptions={getAutocompleteOptions}
                getOptionValue={(option) => option.userCode}
                getOptionLabel={(option) => option.userDesc}
                components={{
                    Option: UserOption,
                }}
                onChange={addUserToWatchlist}
                value={null}
                filterOption={filterOptions}
                maxMenuHeight={150}
                noOptionsMessage={
                    () => <Typography color='textSecondary'><i>No options.</i></Typography>
                }
                menuIsOpen
            />
        </>
    )
}

export default Watchlist;
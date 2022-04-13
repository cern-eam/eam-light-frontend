import React, { useState } from 'react';
import { CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import EAMFormLabel from 'eam-components/ui/components/inputs/EAMFormLabel';
import { Account, Delete } from 'mdi-material-ui';
import WS from '../../../tools/WS';
import { Autocomplete } from '@mui/material';
import WSWorkorders from '../../../tools/WSWorkorders';

const Watchlist = (props) => {
    const { addUserToWatchlist, isLoading, removeUserFromWatchlist, watchers, woCode } = props;

    const [options, setOptions] = useState([]);

    const filterOptions = (candidates) =>
        candidates.filter((candidate) => !watchers?.some((watcherCode) => watcherCode.userCode === candidate.usercode));

    const getAutocompleteOptions = async (hint) => {
        if (hint) {
            const result = await WSWorkorders.autocompleteUsersWithAccess(woCode, hint);
            setOptions(result.body.data);
        }
    };

    const paperStyle = {
        boxShadow: '0 0 0 1px hsla(0,0%,0%,0.1),0 4px 11px hsla(0,0%,0%,0.1)',
        height: 135,
        marginTop: '5px',
        marginBottom: '10px',
        padding: '3px',
        overflowY: 'auto',
    };

    return (
        <>
            <EAMFormLabel label="Current Watchers" labelStyle={{ fontWeight: 'normal', marginTop: '1.5rem' }} />
            <Paper style={paperStyle}>
                {watchers?.length > 0 ? (
                    isLoading ? (
                        <div
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        watchers.map((watcher) => (
                            <>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ebebeb' }}
                                >
                                    <Account />
                                    <Typography variant="subtitle2" color="textPrimary">
                                        {watcher.userDesc.toUpperCase()}
                                    </Typography>
                                    <IconButton
                                        onClick={() => removeUserFromWatchlist(watcher.userCode)}
                                        size="small"
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </div>
                            </>
                        ))
                    )
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="textSecondary">
                            <i>No watchers.</i>
                        </Typography>
                    </div>
                )}
            </Paper>

            <EAMFormLabel
                label="Add Watchers"
                labelStyle={{ fontWeight: 'normal', marginTop: '1rem', marginBottom: 5 }}
            />
            <Autocomplete
                options={options}
                filterOptions={filterOptions}
                onInputChange={(_, value) => getAutocompleteOptions(value)}
                onChange={(_, value) => 
                    addUserToWatchlist(value)
                }
                getOptionLabel={(option) => option.description.toUpperCase()}
                blurOnSelect
                onFocus={() => setOptions([])}
                forcePopupIcon={false}
                value={null} // To force the selected value to disappear on blur
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Search for watchers..." />
                )}
                PaperComponent={(props) =>
                    options.length === 0 ? (
                        <Paper {...props} style={paperStyle}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <Typography color="textSecondary">
                                    <i>No options.</i>
                                </Typography>
                            </div>
                        </Paper>
                    ) : (
                        <Paper {...props} style={paperStyle} />
                    )
                }
            />
        </>
    );
};

export default Watchlist;

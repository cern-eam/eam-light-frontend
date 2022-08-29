import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import { Close } from 'mdi-material-ui';
import WSWatchers from '../../../tools/WSWatchers';
import WS from '../../../tools/WS';
import Watchlist from './Watchlist';


const EditWatchlistDialog = ({ open, woCode, userCode, handleClose, handleError }) => {
    const [isWatching, setIsWatching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [watchers, setWatchers] = useState();

    const getWatchers = async () => {
        setIsLoading(true);

        const response = await WSWatchers.getWatchersForWorkOrder(woCode);
        setWatchers(response.body.data);
        
        const isWatcher = response.body.data.some((watcher) => watcher.userCode === userCode);
        setIsWatching(isWatcher);

        setIsLoading(false);
    };

    useEffect(() => {
        getWatchers();
    }, []);

    const toggleWatcherStatus = async () => {
        const endpoint = isWatching ? WSWatchers.removeWatchersFromWorkOrder : WSWatchers.addWatchersToWorkOrder;
        try {
            setIsLoading(true);
            await endpoint(woCode, [userCode]).then(getWatchers);
            setIsWatching(!isWatching);
        } catch (e) {
            handleError(e);
        }
    };

    const addUserToWatchlist = (value) => {
        if (value) {
            WSWatchers.addWatchersToWorkOrder(woCode, [value.userCode]).then(getWatchers);
        }
    };

    const removeUserFromWatchlist = (userCode) => {
        WSWatchers.removeWatchersFromWorkOrder(woCode, [userCode]).then(getWatchers);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
                id="alert-dialog-title"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="textPrimary">Watchlist</Typography>
                <IconButton onClick={handleClose} size="large">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{minHeight: 325}}>
                <Button
                    fullWidth
                    onClick={toggleWatcherStatus}
                    variant="contained"
                    disabled={isLoading}
                    color='primary'
                    style={{ marginTop: -5, backgroundColor: isWatching && !isLoading && "#d32f2f" }}
                >
                    {isWatching ? 'Remove Me' : 'Add Me'}
                </Button>
                <Watchlist
                    woCode={woCode}
                    addUserToWatchlist={addUserToWatchlist}
                    isLoading={isLoading}
                    removeUserFromWatchlist={removeUserFromWatchlist}
                    watchers={watchers}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditWatchlistDialog;

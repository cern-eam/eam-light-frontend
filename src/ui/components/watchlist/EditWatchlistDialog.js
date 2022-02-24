import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
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
            WSWatchers.addWatchersToWorkOrder(woCode, [value.usercode]).then(getWatchers);
        }
    };

    const removeUserFromWatchlist = (userCode) => {
        WSWatchers.removeWatchersFromWorkOrder(woCode, [userCode]).then(getWatchers);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle disableTypography id="alert-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="textPrimary">Watchlist</Typography>
                <IconButton onClick={handleClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{minHeight: 450}}>
                <Button
                    fullWidth
                    onClick={toggleWatcherStatus}
                    variant="contained"
                    disabled={isLoading}
                    color='primary'
                    style={{ marginBottom: "5px", marginTop: -5, backgroundColor: isWatching && !isLoading && "#d32f2f" }}
                >
                    {isWatching ? 'Remove Me' : 'Add Me'}
                </Button>
                <Watchlist
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

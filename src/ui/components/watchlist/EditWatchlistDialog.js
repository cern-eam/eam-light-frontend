import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
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
        const watchersCodes = response.body.data.map((watcher) => watcher.WAT_PERSON);
        const watcherPromises = [];
        watchersCodes.forEach((watcher) => {
            const watcherPromise = WS.autocompleteUsers(watcher);
            watcherPromises.push(watcherPromise);
        });

        Promise.all(watcherPromises).then((results) => {
            const watchers = results.flatMap((result) => result.body.data);
            setWatchers(watchers);
            const isWatcher = watchersCodes.some((watcher) => watcher === userCode);
            setIsWatching(isWatcher);
            setIsLoading(false);
        });
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

    const addUserToWatchlist = (values) => {
        if (values) {
            const userCodes = values.map((v) => v.usercode);
            WSWatchers.addWatchersToWorkOrder(woCode, userCodes).then(getWatchers);
        }
    };

    const removeUserFromWatchlist = (userCode) => {
        WSWatchers.removeWatchersFromWorkOrder(woCode, [userCode]).then(getWatchers);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle id="alert-dialog-title">Watchlist</DialogTitle>
            <DialogContent style={{minHeight: 500}}>
                <Button
                    fullWidth
                    onClick={toggleWatcherStatus}
                    variant="contained"
                    disabled={isLoading}
                    color="primary"
                    style={{ margin: "5px" }}
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
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditWatchlistDialog;

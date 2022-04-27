import React, { useState } from 'react';
import { Input } from '@mui/material';
import { Alert } from '@mui/material';
import KeyCode from 'eam-components/enums/KeyCode';
import WS from '../../../tools/WS';
import BlockUi from 'react-block-ui';
import { withCernMode } from '../CERNMode';
import GridTools from '../../../tools/GridTools';

const setUser = (userId, onSuccess, onError, mode) => {
    if (userId) {
        WS.getUserDataToImpersonate(userId, mode)
            .then(resp => onSuccess(resp.body.data))
            .catch(onError)
            ;
    } else {
        onError();
    }
}

// For future
const MODES = {
    ALL: "ALL",
    PERSON: "PERSON",
}

/**
 * Allows user to scan card
 */
const ScanUser = ({ updateScannedUser, showNotification, handleError }) => {
        const [cernId, updateCernId] = useState("");
        //const [ref, updateRef] = useState(null);
        const [loading, setLoading] = useState(null);
        const [scannerTimeout, setScannerTimeout] = useState(null);
        const scannerOnly = GridTools.getURLParameterByName("scannerOnly") !== "false";
        const mode = GridTools.getURLParameterByName("mode") || MODES.PERSON;
        const [focus, setFocus] = useState(false)

        const updateUser = (evt) => {
            if (loading) return;
            evt.persist();
            setLoading(true);
            const onSuccess = (user) => {
                showNotification(`Welcome, ${user.userDesc}!`)
                setLoading(false);
                updateScannedUser(user);
            }
            const onError = (e) => {
                e && handleError(e);
                setLoading(false);
                updateCernId("");
                evt.target && evt.target.focus();
                //ref && ref.focus();
            }
            setUser(cernId, onSuccess, onError, mode);
        }

        return (
            <div style={{zIndex: '1399', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: "flex", flexDirection: 'column'}}>
                <BlockUi blocking={loading} style={{zIndex: '1399', backgroundColor: 'rgba(255, 255, 255, 1)', position: 'absolute', width: '50%', height: '50%', alignItems: 'center', justifyContent: 'center', display: "flex", flexDirection: 'column'}}>
                    <span className="FontLatoBlack Fleft Fs30 DispBlock" style={{fontSize: '18px', color: "#02a2f2"}}>{mode === MODES.PERSON ? "Scan your CERN badge: " : "Insert your ID: "}</span>
                        <Input
                            autoFocus
                            type={mode === MODES.PERSON && "password"}
                            value={cernId}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (scannerOnly && value && (value.length - (cernId || "").length) > 1) {
                                    updateCernId("");
                                } else {
                                    updateCernId(value && (mode === MODES.PERSON ? value.replace(/\D/g,''): value.toUpperCase()))
                                }
                            }}
                            placeholder={mode === MODES.PERSON ? "Person ID" : "CERN ID, Person ID or Login"}
                            style={{width: '200px'}}
                            onFocus={() => setFocus(true)}
                            onBlur={(evt) => {setFocus(false); !scannerOnly && updateUser(evt)}}
                            onKeyDown={(event) => {
                                if (scannerOnly) {
                                    clearTimeout(scannerTimeout);
                                    setScannerTimeout(setTimeout(() => updateCernId(""), 100));
                                }
                                event.keyCode === KeyCode.ENTER && updateUser(event)
                            }}
                        />
                        {!focus ?
                            <div style={{position: 'relative', width: '90%', maxWidth: '450px', display: 'flex', justifyContent: 'center'}}>
                                <Alert style={{position: 'absolute', marginTop: '8px'}} variant="outlined" severity="warning">
                                    Problems scanning? Make sure the input field above is selected before using the scanner on your CERN badge
                                </Alert>
                            </div>
                            : null
                        }
                </BlockUi>
            </div>
        );
}

export default withCernMode(ScanUser);
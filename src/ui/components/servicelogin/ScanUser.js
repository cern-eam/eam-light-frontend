import React, { useState } from 'react';
import { Input } from '@material-ui/core';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import KeyCode from '../../../enums/KeyCode';
import WS from '../../../tools/WS';
import BlockUi from 'react-block-ui';

const setUser = (employeeCode, onSuccess, onError) => {
    if (employeeCode) {
        WS.getUserDataFromEmployeeCode(employeeCode)
            .then(resp => onSuccess(resp.body.data))
            .catch(onError)
            ;
    } else {
        onError();
    }
}

/**
 * Allows user to scan card
 */
const ScanUser = ({ updateScannedUser, handleError }) => {
        const [cernId, updateCernId] = useState("");
        //const [ref, updateRef] = useState(null);
        const [loading, setLoading] = useState(null);

        const updateUser = (evt) => {
            evt.persist();
            setLoading(true);
            const onSuccess = (user) => {
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
            setUser(cernId, onSuccess, onError);
        }

        return <div style={{zIndex: '9999', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', display: "flex", flexDirection: 'column'}}>
            <BlockUi blocking={loading} style={{zIndex: '10000', backgroundColor: 'rgba(255, 255, 255, 1)', position: 'absolute', width: '50%', height: '50%', alignItems: 'center', justifyContent: 'center', display: "flex", flexDirection: 'column'}}>
                <span className="FontLatoBlack Fleft Fs30 DispBlock" style={{fontSize: '20px', color: "#02a2f2"}}>Scan your card: </span>
                <Input
                    //ref={that => that.focus()}
                    autoFocus
                    value={cernId}
                    onChange={(event) => updateCernId(event.target.value)}
                    placeholder={"CERN ID"}
                    style={{maxWidth: '200px'}}
                    onBlur={updateUser}
                    onKeyDown={(event) => event.keyCode === KeyCode.ENTER && updateUser(event)}
                />
            </BlockUi>
        </div>
}

export default ScanUser;
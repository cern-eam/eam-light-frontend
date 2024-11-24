import React, { useState, useEffect } from 'react';
import BlockUi from 'react-block-ui';
import Grid from '@mui/material/Grid';
import ReplaceEqpHierarchy from "./ReplaceEqpHierarchy";
import ReplaceEqpGeneral from "./ReplaceEqpGeneral";
import WSEquipment from "../../../../tools/WSEquipment";
import './ReplaceEqp.css';
import queryString from "query-string";
import useUserDataStore from '../../../../state/useUserDataStore';
import useApplicationDataStore from '../../../../state/useApplicationDataStore';
import useLayoutStore from '../../../../state/useLayoutStore';
import { renderLoading } from '../../EntityTools';

const MODE_STANDARD = 'Standard';

const initEqpReplacement = {
    oldEquipment: '',
    oldEquipmentDesc:'',
    oldEquipmentStatus: '',
    oldEquipmentState: '',
    newEquipment: '',
    newEquipmentDesc: '',
    newEquipmentStatus: 'I',
    replacementMode: MODE_STANDARD
};

const ReplaceEqp = (props) => {
    const {
        handleError,
        showError,
        showNotification,
        showWarning
    } = props;

    const [blocking, setBlocking] = useState(false);
    const [newEquipment, setNewEquipment] = useState(undefined);
    const [oldEquipment, setOldEquipment] = useState(undefined);
    const [replaceEquipment, setReplaceEquipment] = useState(initEqpReplacement);
    const [stateList, setStateList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const { userData } = useUserDataStore();
    const { applicationData } = useApplicationDataStore();
    const cryoClasses = applicationData.EL_CRYOC;

    const {screenLayout: {[userData.assetScreen]: equipmentLayout }, fetchScreenLayout} = useLayoutStore();

    useEffect(() => {
        if (!equipmentLayout) {
            fetchScreenLayout(userData.eamAccount.userGroup, "OBJ", "OSOBJA", userData.assetScreen, [])
        }
    }, [equipmentLayout])

    useEffect(() => {
        //Check URL parameters
        const values = queryString.parse(window.location.search)
        const oldEquipment = values.oldEquipment;
        const newEquipment = values.newEquipment;
        //Get all the properties
        if (oldEquipment) {
            updateEqpReplacementProp('oldEquipment', oldEquipment);
        }
        if (newEquipment) {
            updateEqpReplacementProp('newEquipment', newEquipment);
        }
        WSEquipment.getEquipmentStateValues()
            .then(resp => setStateList(resp.body.data))
            .catch(handleError)
    }, [])

    useEffect(() => {
        loadStatuses();
    }, [oldEquipment, replaceEquipment.oldEquipmentStatus, userData.eamAccount.userGroup]);

    const loadStatuses = () => {
        if(!replaceEquipment.oldEquipment) {
            setStatusList([]);
            setReplaceEquipment((prevState) => ({
                ...prevState,
                oldEquipmentStatus: '',
            }))
            return;
        }

        let oldEquipmentStatus = replaceEquipment.oldEquipmentStatus;
        const userGroup = userData.eamAccount.userGroup;

        if (oldEquipmentStatus === 'C') {
            showWarning('The equipment selected is in store. If you have access, and the new equipment is not in a different store, an issue/return transaction will be performed before/after the structure update.', 'Equipment in store!');
            oldEquipmentStatus = 'I'; //Interceptor will issue the part.
            updateEqpReplacementProp('oldEquipmentStatus', 'I');
        }

        //Load list of statuses
        WSEquipment.getEquipmentStatusValues(userGroup, false, oldEquipmentStatus)
            .then(response => {
                const data = response.body.data;
                data.sort(({desc: a}, {desc: b}) => a < b ? -1 : a > b ? 1 : 0);
                setStatusList(data);
        }).catch(error => handleError(error));
    }

    const updateEqpReplacementProp = (key, value) => {
        setReplaceEquipment((prevState) => ({
            ...prevState,
            [key]: value
        }))
    };

    const onChangeOldEquipment = (value) => {
        if (value) {
            loadEquipmentData(value, 'oldEquipment');
        } else {
            setOldEquipment(undefined);
            loadStatuses();
        }
    };

    const onChangeNewEquipment = (value) => {
        if (value) {
            loadEquipmentData(value, 'newEquipment');
        } else {
            setNewEquipment(undefined);
        }
    };

    /**
     * Load the equipment data when it is selected
     * @param code the equipment code
     * @param destination The property destination
     */
    const loadEquipmentData = async (code, destination) => {
        setBlocking(true);
        try {
            const response = await WSEquipment.getEquipment(code);

            if (destination === 'oldEquipment') {
                setOldEquipment(response.body.data);

                // Set status/state for old equipment
                let oldEquipmentStatus;
                let oldEquipmentState;

                if ((cryoClasses || []).includes(response.body.data.classCode)) {
                    oldEquipmentStatus = 'IRP';
                    oldEquipmentState = 'DEF';
                } else {
                    oldEquipmentStatus = response.body.data.statusCode;
                    oldEquipmentState = response.body.data.stateCode;
                }
                setReplaceEquipment((prevState) => ({
                    ...prevState,
                    oldEquipmentStatus,
                    oldEquipmentState,
                }));
            } else if (destination === 'newEquipment') {
                setNewEquipment(response.body.data);
            }
            setBlocking(false);
        } catch (error) {
            setBlocking(false);
            // TODO: no handleError here?
        }
    };

    const replaceEquipmentHandler = () => {
        setBlocking(true);
        //Remove desc properties
        let replaceEquipmentSubmit = {...replaceEquipment};
        delete replaceEquipmentSubmit.oldEquipmentDesc;
        delete replaceEquipmentSubmit.newEquipmentDesc;
        WSEquipment.replaceEquipment(replaceEquipmentSubmit)
            .then(response => {
                //Load the new data from old and new equipment
                loadEquipmentData(replaceEquipmentSubmit.oldEquipment, 'oldEquipment');
                loadEquipmentData(replaceEquipmentSubmit.newEquipment, 'newEquipment');
                showNotification(response.body.data);
            })
            .catch(error => handleError(error))
            .finally(() => setBlocking(false));
    };

    if (!equipmentLayout) {
        return renderLoading("Loading Screen Layout")
    }

    return (
        <div className="entityContainer" >
            <BlockUi tag="div" blocking={blocking} style={{height: "100%", width: "100%"}}>
                <div id="entityContent" style={{height: "calc(100% - 70px)"}}>
                    <Grid container spacing={1}>
                        <Grid item sm={6} xs={12}>
                            <ReplaceEqpGeneral replaceEquipment={replaceEquipment}
                                                updateProperty={updateEqpReplacementProp}
                                                onChangeOldEquipment={onChangeOldEquipment}
                                                onChangeNewEquipment={onChangeNewEquipment}
                                                equipmentLayout={equipmentLayout}
                                                statusList={statusList}
                                                stateList={stateList}
                                                replaceEquipmentHandler={replaceEquipmentHandler}
                                                showError={showError}
                                                handleError={handleError}
                                                setBlocking={setBlocking}/>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <ReplaceEqpHierarchy equipment={oldEquipment} title="CURRENT HIERARCHY OF THE OLD EQUIPMENT"
                                                    equipmentLayout={equipmentLayout}/>
                            <ReplaceEqpHierarchy equipment={newEquipment} title="CURRENT HIERARCHY OF THE NEW EQUIPMENT"
                                                    equipmentLayout={equipmentLayout}/>
                        </Grid>
                    </Grid>
                </div>
            </BlockUi>
        </div>

    );
}

export default ReplaceEqp;
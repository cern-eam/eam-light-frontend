import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import EAMDatePicker from "eam-components/dist/ui/components/muiinputs/EAMDatePicker";
import KeyCode from "../../../../../enums/KeyCode";

/**
 * Display detail of an activity
 */
function AddActivityDialog(props) {

    let [loading, setLoading] = useState(false);
    let [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (props.open) {
            init()
        }
    }, [props.open])

    let init = () => {
        setLoading(true)
        WSWorkorders.initWorkOrderActivity(props.workorderNumber).then(response => {
            setFormValues(response.body.data);
            setLoading(false);
        });
    };

    let handleClose = () => {
        props.onClose();
    };

    let handleSave = () => {
        let activity = {...formValues}
        delete activity.taskDesc;
        delete activity.tradeDesc;
        delete activity.materialListDesc;

        setLoading(true);
        WSWorkorders.createWorkOrderActivity(activity)
            .then(result => {
                //Post add handler
                props.postAddActivityHandler();
                setLoading(false);
                props.showNotification("Activity successfully created");
                handleClose();
                props.onChange();
                init();
            })
            .catch(error => {
                setLoading(false);
                props.handleError(error)
            });
    };

    let updateFormValues = (key, value) => {
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            [key]: value
        }))
    };

    let onKeyDown = (e) => {
        if (e.keyCode === KeyCode.ENTER) {
            handleSave();
        }
    }

    return (
        <div onKeyDown={onKeyDown}>
            <Dialog
                fullWidth
                id="addActivityDialog"
                open={props.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                disableBackdropClick={true}>

                <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>

                <DialogContent id="content">
                    <div>
                        <BlockUi tag="div" blocking={loading}>
                            <EAMInput
                                elementInfo={props.layout.activity}
                                valueKey="activityCode"
                                value={formValues['activityCode']}
                                updateProperty={updateFormValues}
                            />

                            <EAMInput
                                elementInfo={props.layout.activitynote}
                                valueKey="activityNote"
                                value={formValues['activityNote']}
                                updateProperty={updateFormValues}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTTrade}
                                elementInfo={props.layout.trade}
                                valueKey="tradeCode"
                                value={formValues['tradeCode']}
                                valueDesc={formValues['tradeDesc']}
                                descKey="tradeDesc"
                                updateProperty={updateFormValues}/>

                            <EAMInput
                                required={true}
                                elementInfo={props.layout.personsreq}
                                valueKey="peopleRequired"
                                value={formValues['peopleRequired']}
                                updateProperty={updateFormValues}
                            />

                            <EAMInput
                                required={true}
                                elementInfo={props.layout.esthrs}
                                valueKey="estimatedHours"
                                value={formValues['estimatedHours']}
                                updateProperty={updateFormValues}
                            />

                            <EAMDatePicker
                                elementInfo={props.layout.actstartdate}
                                valueKey="startDate"
                                value={formValues['startDate']}
                                updateProperty={updateFormValues}
                            />

                            <EAMDatePicker
                                elementInfo={props.layout.actenddate}
                                valueKey="endDate"
                                value={formValues['endDate']}
                                updateProperty={updateFormValues}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTTask}
                                elementInfo={props.layout.task}
                                valueKey="taskCode"
                                value={formValues['taskCode']}
                                valueDesc={formValues['taskDesc']}
                                descKey="taskDesc"
                                updateProperty={updateFormValues}/>

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTMatList}
                                elementInfo={props.layout.matlcode}
                                valueKey="materialList"
                                value={formValues['materialList']}
                                valueDesc={formValues['materialListDesc']}
                                descKey="materialListDesc"
                                updateProperty={updateFormValues}/>

                        </BlockUi>
                    </div>
                </DialogContent>

                <DialogActions>
                    <div>
                        <Button onClick={handleClose} color="primary" disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary" disabled={loading} autoFocus>
                            Save
                        </Button>
                    </div>
                </DialogActions>

            </Dialog>
        </div>
    )
}

export default AddActivityDialog;
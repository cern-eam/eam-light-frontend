import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import WSWorkorders from "../../../../../tools/WSWorkorders";
import KeyCode from "eam-components/dist/enums/KeyCode";
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import {createOnChangeHandler, processElementInfo} from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import LightDialog from 'ui/components/LightDialog';
import Stack from "@mui/material/Stack";

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

    useEffect(() => {
        computeHoursWorked()
    }, [formValues["startHour"], formValues["startMinutes"], formValues["endHour"], formValues["endMinutes"]])
    //
    // useEffect(() => {
    //     //computeEndTime()
    // }, [formValues['hoursWorked']])

    let init = () => {
        setFormValues({
            workOrderNumber: props.workorderNumber,
            departmentCode: props.department,
            departmentDesc: props.departmentDesc,
            employeeCode: props.defaultEmployee,
            employeeDesc: props.defaultEmployeeDesc,
            activityCode: props.activities.length === 1 ? '5' : null,
            typeOfHours: 'N',
            dateWorked: new Date()
        });
    };

    let handleClose = () => {
        props.onClose();
    };

    let handleSave = () => {
        // Populate trade code
        let tradeCode = "";
        let filteredActivities = props.activities.filter(activity => activity.activityCode === formValues.activityCode);
        if (filteredActivities.length === 1) {
            tradeCode = filteredActivities[0].tradeCode;
        }

        let bookingLabour = {
            ...formValues,
            tradeCode
        }
        delete bookingLabour.departmentDesc;

        setLoading(true);
        WSWorkorders.createBookingLabour(bookingLabour)
            .then(WSWorkorders.getWorkOrder.bind(null, props.workorderNumber))
            .then(result => {
                setLoading(false);

                const workorder = result.body.data;
                if (props.updateCount + 1 === workorder.updateCount
                    && props.startDate === null) {
                    props.updateEntityProperty('startDate', workorder.startDate);
                    props.updateEntityProperty('updateCount', props.updateCount + 1);
                } else if (props.updateCount !== workorder.updateCount
                    || props.startDate !== workorder.startDate) {
                    // an unexpected situation has happened, reload the page
                    window.location.reload();
                }

                props.showNotification("Booking labour successfully created")
                handleClose();
                props.onChange();
            })
            .catch(error => {
                setLoading(false)
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
            e.stopPropagation();
            handleSave();
        }
    }

    let computeHoursWorked = () => {
        const startHour = parseInt(formValues["startHour"] || "00");
        const startMinutes = parseInt(formValues["startMinutes"] || "00");
        const endHour = parseInt(formValues["endHour"] || "00");
        const endMinutes = parseInt(formValues["endMinutes"] || "00");
        const timeWorked = (endHour * 60 + endMinutes) - (startHour * 60 + startMinutes)

        if (timeWorked < 0) {
            updateFormValues("endHour", startHour)
            updateFormValues("endMinutes", startMinutes)
        }
        updateFormValues("hoursWorked", (timeWorked / 60) || "0")
    }

    let computeEndTime = () => {
        const startHour = parseInt(formValues["startHour"] || "00");
        const startMinutes = parseInt(formValues["startMinutes"] || "00");
        // const endHour = parseInt(formValues["endHour"] || "00");
        // const endMinutes = parseInt(formValues["endMinutes"] || "00");
        const [hoursWorked, minutesWorked] = (formValues["hoursWorked"] || 0).toString().split(".")
        updateFormValues("endHour", startHour + parseInt(hoursWorked || "0"))
        updateFormValues("endMinutes", startMinutes + parseInt(minutesWorked || "0"))
    }

    let validateHourInput = (input) => parseInt(input) > 23 ? "00" : input;
    let validateMinuteInput = (input) => parseInt(input) > 59 ? "00" : input;

    return (
        <div onKeyDown={onKeyDown}>
            <LightDialog
                fullWidth
                id="addBookLabourDialog"
                open={props.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Book Labor</DialogTitle>

                <DialogContent id="content">
                    <div>
                        <BlockUi tag="div" blocking={loading}>
                            <EAMSelect
                                {...processElementInfo(props.layout.booactivity)}
                                value={formValues['activityCode'] || ''}
                                options={props.activities.map(activity => {
                                    return {
                                        code: activity.activityCode,
                                        desc: activity.tradeCode
                                    }
                                })}
                                onChange={createOnChangeHandler("activityCode", null, null, updateFormValues)}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteBOOEmployee}
                                {...processElementInfo(props.layout.employee)}
                                value={formValues['employeeCode'] || ''}
                                desc={formValues['employeeDesc']}
                                onChange={createOnChangeHandler("employeeCode", "employeeDesc", null, updateFormValues)}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteBOODepartment}
                                {...processElementInfo(props.layout.department)}
                                value={formValues['departmentCode'] || ''}
                                desc={formValues['departmentDesc']}
                                onChange={createOnChangeHandler("departmentCode", "departmentDesc", null, updateFormValues)}
                            />

                            <EAMDatePicker
                                {...processElementInfo(props.layout.datework)}
                                value={formValues['dateWorked']}
                                onChange={createOnChangeHandler("dateWorked", null, null, updateFormValues)}
                            />

                            <EAMSelect
                                {...processElementInfo(props.layout.octype)}
                                value={formValues['typeOfHours'] || ''}
                                autocompleteHandler={WSWorkorders.getTypesOfHours}
                                onChange={createOnChangeHandler("typeOfHours", null, null, updateFormValues)}
                            />

                            <EAMTextField
                                {...processElementInfo(props.layout.hrswork)}
                                value={formValues['hoursWorked']}
                                onChange={createOnChangeHandler("hoursWorked", null, null, updateFormValues)}
                            />

                            <Stack direction="row" spacing={2} style={{display: 'inline-flex', alignItems: 'center'}}>
                                <EAMTextField
                                    {...processElementInfo(props.layout.actstarttime)}
                                    type="number"
                                    value={formValues['startHour']}
                                    maxLength={2}
                                    onChange={val => updateFormValues("startHour", validateHourInput(val))}
                                />
                                <div style={{marginTop: '24px'}}>:</div>
                                <EAMTextField
                                    {...processElementInfo(props.layout.actstarttime)}
                                    type="number"
                                    value={formValues['startMinutes']}
                                    maxLength={2}
                                    onChange={val => updateFormValues("startMinutes", validateMinuteInput(val))}
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} style={{display: 'inline-flex', alignItems: 'center'}}>
                                <EAMTextField
                                    {...processElementInfo(props.layout.actendtime)}
                                    type="number"
                                    value={formValues['endHour']}
                                    maxLength={2}
                                    onChange={val => updateFormValues("endHour", validateHourInput(val))}
                                />
                                <div style={{marginTop: '24px'}}>:</div>
                                <EAMTextField
                                    {...processElementInfo(props.layout.actendtime)}
                                    type="number"
                                    value={formValues['endMinutes']}
                                    maxLength={2}
                                    onChange={val => updateFormValues("endMinutes", validateMinuteInput(val))}
                                />
                            </Stack>
                        </BlockUi>
                    </div>
                </DialogContent>

                <DialogActions>
                    <div>
                        <Button onClick={handleClose} color="primary" disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary" disabled={loading}>
                            Save
                        </Button>
                    </div>
                </DialogActions>

            </LightDialog>
        </div>
    );
}

export default AddActivityDialog;
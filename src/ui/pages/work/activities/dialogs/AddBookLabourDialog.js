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
import EAMTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMTimePicker';

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
        console.log(key, value)
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

    let updateTimeWorked = (startHour, endHour) => {
        const timeWorked = (endHour.getHours() * 60 + endHour.getMinutes()) - (startHour.getHours() * 60 + startHour.getMinutes())
        updateFormValues("hoursWorked", (timeWorked / 60) || "0")
    }

    let updateStartHour = (key, value) => {
        let startTime = new Date(value)
        const endTime = new Date(formValues['endHour'])

        if(startTime > endTime) {
            startTime = endTime
        }

        updateFormValues('startHour', startTime.toString())
        updateTimeWorked(startTime, endTime)
    }

    let updateEndHour = (key, value) => {
        let endTime = new Date(value)
        const startTime = new Date(formValues['startHour'])

        if(startTime > endTime) {
            endTime = startTime
        }

        updateFormValues('endHour', endTime.toString())
        updateTimeWorked(startTime, endTime)
    }
    let updateHoursWorked = (key, value) => {
        const startTime = new Date(formValues['startHour'])
        const endTime = new Date(formValues['endHour'])
        const [hoursWorked, minutesWorked] = (value || "0.0").split(".")

        const newEndTime = endTime.setHours(startTime.getHours() + parseInt(hoursWorked),
            startTime.getMinutes() + parseInt(minutesWorked || '0') * 6)

        updateFormValues('endHour', newEndTime)
        updateFormValues("hoursWorked", value)
    }

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
                                onChange={createOnChangeHandler("hoursWorked", null, null, updateHoursWorked)}
                            />
                            <EAMTimePicker
                                {...processElementInfo(props.layout.actstarttime)}
                                value={formValues['startHour'] || null}
                                onChange={createOnChangeHandler("startHour", null, null, updateStartHour)}
                            />
                            <EAMTimePicker
                                {...processElementInfo(props.layout.actendtime)}
                                value={formValues['endHour'] || null}
                                onChange={createOnChangeHandler("endHour", null, null, updateEndHour)}
                            />
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
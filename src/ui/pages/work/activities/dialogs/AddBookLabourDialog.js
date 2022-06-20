import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import EAMInput from "eam-components/ui/components/muiinputs/EAMInput";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import EAMSelect from "eam-components/ui/components/muiinputs/EAMSelect";
import EAMDatePicker from "eam-components/ui/components/muiinputs/EAMDatePicker";
import EAMAutocomplete from "eam-components/ui/components/muiinputs/EAMAutocomplete";
import KeyCode from "../../../../../enums/KeyCode";

/**
 * Display detail of an activity
 */
function AddActivityDialog(props) {

    let [loading, setLoading] = useState(false);
    let [formValues, setFormValues] = useState({});
    let [typesOfHours, setTypesOfHours] = useState([]);

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
        WSWorkorders.getTypesOfHours().then(response => setTypesOfHours(response.body.data));
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

    return (
        <div onKeyDown={onKeyDown}>
            <Dialog
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
                                elementInfo={props.layout.booactivity}
                                valueKey="activityCode"
                                value={formValues['activityCode'] || ''}
                                values={props.activities.map(activity => {
                                    return {
                                        code: activity.activityCode,
                                        desc: activity.tradeCode
                                    }
                                })}
                                updateProperty={updateFormValues}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteBOOEmployee}
                                elementInfo={props.layout.employee}
                                valueKey="employeeCode"
                                value={formValues['employeeCode']}
                                valueDesc={formValues['employeeDesc']}
                                descKey="employeeDesc"
                                updateProperty={updateFormValues}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteBOODepartment}
                                elementInfo={props.layout.department}
                                valueKey="departmentCode"
                                value={formValues['departmentCode']}
                                valueDesc={formValues['departmentDesc']}
                                descKey="departmentDesc"
                                updateProperty={updateFormValues}
                            />

                            <EAMDatePicker
                                elementInfo={props.layout.datework}
                                valueKey="dateWorked"
                                value={formValues['dateWorked']}
                                updateProperty={updateFormValues}
                            />

                            <EAMSelect
                                elementInfo={props.layout.octype}
                                valueKey="typeOfHours"
                                value={formValues['typeOfHours'] || ''}
                                values={typesOfHours}
                                updateProperty={updateFormValues}
                            />

                            <EAMInput
                                elementInfo={props.layout.hrswork}
                                valueKey="hoursWorked"
                                value={formValues['hoursWorked']}
                                updateProperty={updateFormValues}
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

            </Dialog>
        </div>
    );
}

export default AddActivityDialog;
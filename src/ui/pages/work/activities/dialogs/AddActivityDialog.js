import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui';
import './AddActivityDialog.css';
import WSWorkorders from '../../../../../tools/WSWorkorders';
import KeyCode from 'eam-components/dist/enums/KeyCode';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import { createOnChangeHandler, processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import LightDialog from 'ui/components/LightDialog';

/**
 * Display detail of an activity
 */
function AddActivityDialog(props) {
    let [loading, setLoading] = useState(false);
    let [formValues, setFormValues] = useState({});

    // Passing activity object indicates that we are editing an existing activity
    const { activityToEdit } = props;

    useEffect(() => {
        if (props.open) {
            if (activityToEdit) {
                setFormValues(activityToEdit);
            } else {
                init();
            }
        }
    }, [props.open]);

    let init = () => {
        setLoading(true);
        WSWorkorders.initWorkOrderActivity(props.workorderNumber).then((response) => {
            setFormValues({
                ...response.body.data,
                "workOrderNumber": props.workorderNumber,
                "activityCode": props.newActivityCode,
                "peopleRequired": 1,
                "estimatedHours": 1,
                "startDate": new Date(),
                "endDate": new Date(),
            });
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            props.handleError(error);
        });
    };

    let handleClose = () => {
        props.onClose();
    };

    let handleSave = () => {
        let activity = { ...formValues };
        delete activity.taskDesc;
        delete activity.tradeDesc;
        delete activity.materialListDesc;

        setLoading(true);
        (
            activityToEdit
                ? WSWorkorders.updateWorkOrderActivity(activity)
                : WSWorkorders.createWorkOrderActivity(activity)
        ).then(() => {
            props.postAddActivityHandler();
            setLoading(false);
            props.showNotification(`Activity successfully ${activityToEdit ? 'updated' : 'created'}`);
            handleClose();
            props.onChange();
        })
            .catch((error) => {
                setLoading(false);
                props.handleError(error);
            });
    };

    let updateFormValues = (key, value) => {
        if (key === 'taskCode' && value) {
            onTaskCodeChanged(value);
        }
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [key]: value,
        }));
    };

    let onTaskCodeChanged = (taskcode) => {
        setLoading(true);
        WSWorkorders.getTaskPlan(taskcode)
            .then((response) => {
                const taskPlan = response.body.data;
                updateFormValues('peopleRequired', taskPlan.peopleRequired === null ? '' : taskPlan.peopleRequired);
                updateFormValues('estimatedHours', taskPlan.estimatedHours === null ? '' : taskPlan.estimatedHours);
                updateFormValues('taskDesc', taskPlan.description === null ? '' : taskPlan.description);
                updateFormValues('materialList', taskPlan.materialList === null ? '' : taskPlan.materialList);
                updateFormValues('tradeCode', taskPlan.tradeCode === null ? '' : taskPlan.tradeCode);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    let onKeyDown = (e) => {
        if (e.keyCode === KeyCode.ENTER) {
            e.stopPropagation();
            handleSave();
        }
    };

    return (
        <div onKeyDown={onKeyDown}>
            <LightDialog
                fullWidth
                id="addActivityDialog"
                open={props.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>

                <DialogContent id="content">
                    <div>
                        <BlockUi tag="div" blocking={loading}>
                            <EAMTextField
                                {...processElementInfo(props.layout.activity)}
                                value={formValues['activityCode']}
                                onChange={createOnChangeHandler("activityCode", null, null, updateFormValues)}
                            />

                            <EAMTextField
                                {...processElementInfo(props.layout.activitynote)}
                                value={formValues['activityNote']}
                                onChange={createOnChangeHandler("activityNote", null, null, updateFormValues)}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTTask}
                                {...processElementInfo(props.layout.task)}
                                value={formValues['taskCode']}
                                desc={formValues['taskDesc']}
                                onChange={createOnChangeHandler("taskCode", "taskDesc", null, updateFormValues)}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTMatList}
                                {...processElementInfo(props.layout.matlcode)}
                                value={formValues['materialList']}
                                desc={formValues['materialListDesc']}
                                onChange={createOnChangeHandler("materialList", "materialListDesc", null, updateFormValues)}
                                maxHeight={200}
                            />

                            <EAMAutocomplete
                                autocompleteHandler={WSWorkorders.autocompleteACTTrade}
                                {...processElementInfo(props.layout.trade)}
                                value={formValues['tradeCode']}
                                desc={formValues['tradeDesc']}
                                onChange={createOnChangeHandler("tradeCode", "tradeDesc", null, updateFormValues)}
                            />

                            <EAMTextField
                                {...processElementInfo(props.layout.personsreq)}
                                value={formValues['peopleRequired']}
                                onChange={createOnChangeHandler("peopleRequired", null, null, updateFormValues)}
                            />

                            <EAMTextField
                                {...processElementInfo(props.layout.esthrs)}
                                valueKey="estimatedHours"
                                value={formValues['estimatedHours']}
                                onChange={createOnChangeHandler("estimatedHours", null, null, updateFormValues)}
                            />

                            <EAMDatePicker
                                {...processElementInfo(props.layout.actstartdate)}
                                valueKey="startDate"
                                value={formValues['startDate']}
                                onChange={createOnChangeHandler("startDate", null, null, updateFormValues)}
                            />

                            <EAMDatePicker
                                {...processElementInfo(props.layout.actenddate)}
                                valueKey="endDate"
                                value={formValues['endDate']}
                                onChange={createOnChangeHandler("endDate", null, null, updateFormValues)}
                            />
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
            </LightDialog>
        </div>
    );
}

export default AddActivityDialog;

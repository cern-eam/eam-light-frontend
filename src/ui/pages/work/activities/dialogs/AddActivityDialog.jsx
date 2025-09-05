import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import "./AddActivityDialog.css";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import KeyCode from "eam-components/dist/enums/KeyCode";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import useFieldsValidator from "eam-components/dist/ui/components/inputs-ng/hooks/useFieldsValidator";
import {
  createOnChangeHandler,
  processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import LightDialog from "@/ui/components/LightDialog";
import useSnackbarStore from "../../../../../state/useSnackbarStore";

/**
 * Display detail of an activity
 */
function AddActivityDialog(props) {
  let [loading, setLoading] = useState(false);
  let [formValues, setFormValues] = useState({});
  const {handleError, showNotification} = useSnackbarStore();

  // Passing an 'activityToEdit' object indicates that we are editing an existing activity
  const { activityToEdit, layout } = props;
  
  const fieldsData = {
    activityCode: layout.activity,
    activityNote: layout.activitynote,
    taskCode: layout.task,
    materialList: layout.matlcode,
    tradeCode: layout.trade,
    peopleRequired: layout.personsreq,
    estimatedHours: layout.esthrs,
    startDate: layout.actstartdate,
    endDate: layout.actenddate,
  };

  const { errorMessages, validateFields, resetErrorMessages } =
    useFieldsValidator(fieldsData, formValues);

  useEffect(() => {
    if (props.open) {
      if (activityToEdit) {
        setFormValues(activityToEdit);
      } else {
        init();
      }
    } else {
      resetErrorMessages();
    }
  }, [props.open]);

  let init = () => {
    setLoading(true);
    WSWorkorders.initWorkOrderActivity(props.workorderNumber)
      .then((response) => {
        setFormValues({
          ...response.body.data,
          workOrderNumber: props.workorderNumber,
          activityCode: props.newActivityCode,
          peopleRequired: 1,
          estimatedHours: 1,
          startDate: new Date(),
          endDate: new Date(),
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error);
      });
  };

  let handleClose = () => {
    props.onClose();
  };

  let handleSave = () => {
    
    if (!validateFields()) {
      return;
    }

    let activity = { ...formValues };
    delete activity.taskDesc;
    delete activity.tradeDesc;
    delete activity.materialListDesc;

    setLoading(true);
    (activityToEdit
      ? WSWorkorders.updateWorkOrderActivity(activity)
      : WSWorkorders.createWorkOrderActivity(activity)
    )
      .then(() => {
        props.postAddActivityHandler();
        setLoading(false);
        showNotification(
          `Activity successfully ${activityToEdit ? "updated" : "created"}`
        );
        handleClose();
        props.onChange();
      })
      .catch((error) => {
        setLoading(false);
        handleError(error);
      });
  };

  let updateFormValues = (key, value) => {
    if (key === "taskCode" && value) {
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
        updateFormValues("taskDesc", taskPlan.description);
        updateFormValues("activityNote", taskPlan.description);

        if (taskPlan.peopleRequired) {
          updateFormValues("peopleRequired", taskPlan.peopleRequired);
        }

        if (taskPlan.estimatedHours) {
          updateFormValues("estimatedHours", taskPlan.estimatedHours);
        }

        if (taskPlan.materialList) {
          updateFormValues("materialList", taskPlan.materialList);
        }

        if (taskPlan.tradeCode) {
          updateFormValues("tradeCode", taskPlan.tradeCode);
        }
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
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>

        <DialogContent id="content">
          <div>
            <BlockUi tag="div" blocking={loading}>
              <EAMTextField
                {...processElementInfo(layout.activity)}
                value={formValues["activityCode"]}
                onChange={createOnChangeHandler(
                  "activityCode",
                  null,
                  null,
                  updateFormValues
                )}
                disabled={activityToEdit}
                errorText={errorMessages?.activityCode}
              />

              <EAMTextField
                {...processElementInfo(layout.activitynote)}
                value={formValues["activityNote"]}
                onChange={createOnChangeHandler(
                  "activityNote",
                  null,
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.activityNote}
              />

              <EAMAutocomplete
                autocompleteHandler={WSWorkorders.autocompleteACTTask}
                {...processElementInfo(layout.task)}
                value={formValues["taskCode"]}
                desc={formValues["taskDesc"]}
                onChange={createOnChangeHandler(
                  "taskCode",
                  "taskDesc",
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.taskCode}
              />

              <EAMAutocomplete
                autocompleteHandler={WSWorkorders.autocompleteACTMatList}
                {...processElementInfo(layout.matlcode)}
                value={formValues["materialList"]}
                desc={formValues["materialListDesc"]}
                onChange={createOnChangeHandler(
                  "materialList",
                  "materialListDesc",
                  null,
                  updateFormValues
                )}
                maxHeight={200}
                errorText={errorMessages?.materialList}
              />

              <EAMAutocomplete
                autocompleteHandler={WSWorkorders.autocompleteACTTrade}
                {...processElementInfo(layout.trade)}
                value={formValues["tradeCode"]}
                desc={formValues["tradeDesc"]}
                onChange={createOnChangeHandler(
                  "tradeCode",
                  "tradeDesc",
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.tradeCode}
              />

              <EAMTextField
                {...processElementInfo(layout.personsreq)}
                value={formValues["peopleRequired"]}
                onChange={createOnChangeHandler(
                  "peopleRequired",
                  null,
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.peopleRequired}
              />

              <EAMTextField
                {...processElementInfo(layout.esthrs)}
                valueKey="estimatedHours"
                value={formValues["estimatedHours"]}
                onChange={createOnChangeHandler(
                  "estimatedHours",
                  null,
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.estimatedHours}
              />

              <EAMDatePicker
                {...processElementInfo(layout.actstartdate)}
                valueKey="startDate"
                value={formValues["startDate"]}
                onChange={createOnChangeHandler(
                  "startDate",
                  null,
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.startDate}
              />

              <EAMDatePicker
                {...processElementInfo(layout.actenddate)}
                valueKey="endDate"
                value={formValues["endDate"]}
                onChange={createOnChangeHandler(
                  "endDate",
                  null,
                  null,
                  updateFormValues
                )}
                errorText={errorMessages?.endDate}
              />
            </BlockUi>
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button onClick={handleClose} color="primary" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={loading}
              autoFocus
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </LightDialog>
    </div>
  );
}

export default AddActivityDialog;

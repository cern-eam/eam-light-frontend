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
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import LightDialog from "@/ui/components/LightDialog";
import useEntity from "../../../../../hooks/useEntity";
import { fromEAMNumber } from "../../../EntityTools";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

/**
 * Display detail of an activity
 */
function AddActivityDialog(props) {
  const { activityToEdit, layout, workOrder, open } = props;

  if (!open) {
      return null; 
  }

  const {
    screenLayout: activityLayout,
    loading,
    saveHandler,
    updateEntityProperty: updateActivityProperty,
    register,
    setLoading,
  } = useEntity({
    WS: {
      create: WSWorkorders.createWorkOrderActivity,
      read: WSWorkorders.readWorkOrderActivity,
      update: WSWorkorders.updateWorkOrderActivity,
      delete: WSWorkorders.deleteWorkOrderActivity,
      new: () => WSWorkorders.initWorkOrderActivity(workOrder?.WORKORDERID?.JOBNUM),
    },
    postActions: {
      new: postInit,
      create: postCreate,
      update: postCreate,
      delete: postCreate
    },
    handlers: {
      "TASKSID.TASKCODE": onTaskCodeChanged
    },
    entityCode: "EVNT",
    tabCode: "ACT",
    entityURL: "",
    entityCodeProperty: "ACTIVITYID.ACTIVITYCODE.value",
    entityOrgProperty: "WORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE",
    entityProperty: "Activity",
    resultDataCodeProperty: "JOBNUM",
    resultDefaultDataProperty: "ActivityDefault",
    screenProperty: "workOrderScreen",
    explicitIdentifier: activityToEdit ? `${activityToEdit.workOrderNumber}#*#${activityToEdit.activityCode}`: ``,
    updateWindowTitle: false
  });

  activityLayout.fields.esthrs.fieldType = "text"  

  function postInit(activity) {
    updateActivityProperty("ACTIVITYID.ACTIVITYCODE", activity.ACTIVITYCODE)
    updateActivityProperty("ACTIVITYID.WORKORDERID", workOrder?.WORKORDERID)
    updateActivityProperty("ESTIMATEDHOURS", 1);
    updateActivityProperty("PERSONS", 1);
  }

  let handleClose = () => {
    props.onClose();
  };

  function postCreate() {
    props.postAddActivityHandler();
    props.onChange();
    handleClose();
  }

  function onTaskCodeChanged(task) {
    const taskCode = task['TASKSID.TASKCODE']

    if (!taskCode) {
      return;
    }

    setLoading(true);
    WSWorkorders.getTaskPlan(taskCode)
      .then((response) => {
        const taskPlan = response.body?.Result?.ResultData?.Task;
        updateActivityProperty("ACTIVITYID.ACTIVITYNOTE", taskPlan.TASKLISTID.DESCRIPTION);
        updateActivityProperty("TASKSID", taskPlan.TASKLISTID);
        updateActivityProperty("ESTIMATEDHOURS", fromEAMNumber(taskPlan.HOURSREQUESTED));
        updateActivityProperty("PERSONS", taskPlan.PERSONS);
        updateActivityProperty("TRADEID", taskPlan.TRADEID);
        updateActivityProperty("MATLIST", taskPlan.MATERIALLISTID);
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
              {...register('activity')} disabled={activityToEdit} />

              <EAMTextField {...register('activitynote')} />

              <EAMComboAutocomplete {...register('task')} />

              <EAMComboAutocomplete {...register('matlcode')} />

              <EAMComboAutocomplete {...register('trade')}  />

              <EAMTextField {...register('personsreq')} />

              <EAMTextField {...register('esthrs')} />

              <EAMDatePicker {...register('actstartdate')}  />

              <EAMDatePicker {...register('actenddate')} />

              <EAMTextField {...register('percentcomplete')} />
            </BlockUi>
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button onClick={handleClose} color="primary" disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={saveHandler}
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

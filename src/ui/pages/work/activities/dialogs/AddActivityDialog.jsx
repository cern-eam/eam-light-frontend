import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import "./AddActivityDialog.css";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import KeyCode from "eam-components/dist/enums/KeyCode";
import LightDialog from "@/ui/components/LightDialog";
import useEntity from "../../../../../hooks/useEntity";
import { fromEAMNumber } from "../../../EntityTools";
import EAMInput from "../../../../components/EAMInput";

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
    entity: activity,
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
    pageMode: false
  });

  activityLayout.fields.esthrs.fieldType = "text"  

  function postInit(activity) {
    updateActivityProperty({
      "ACTIVITYID.ACTIVITYCODE": activity.ACTIVITYCODE,
      "ACTIVITYID.WORKORDERID": workOrder?.WORKORDERID,
      "ESTIMATEDHOURS": 1,
      "PERSONS": 1,
    });
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
    console.log("onTaskCodeChanged", task);
    const taskCode = task['TASKSID.TASKCODE']
    
    if (!taskCode) {
      return;
    }
    
    setLoading(true);
    WSWorkorders.getTaskPlan(taskCode)
      .then((response) => {
        const taskPlan = response.body?.Result?.ResultData?.Task;
        updateActivityProperty({
          "ACTIVITYID.ACTIVITYNOTE": taskPlan.TASKLISTID.DESCRIPTION,
          "TASKSID": taskPlan.TASKLISTID,
          "ESTIMATEDHOURS": fromEAMNumber(taskPlan.HOURSREQUESTED),
          "PERSONS": taskPlan.PERSONS,
          "TRADEID": taskPlan.TRADEID,
          "MATLIST": taskPlan.MATERIALLISTID,
        });
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
console.log("AddActivityDialog render", layout);
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
              <EAMInput
              {...register('activity')} disabled={activityToEdit || layout['activity'].readonly} />

              <EAMInput {...register('activitynote')} disabled={layout['activitynote'].readonly}/>

              <EAMInput {...register('task')} disabled={layout['task'].readonly}/>

              <EAMInput {...register('matlcode')} disabled={layout['matlcode'].readonly}/>

              <EAMInput {...register('trade')} disabled={layout['trade'].readonly}/>

              <EAMInput {...register('personsreq')} disabled={layout['personsreq'].readonly}/>

              <EAMInput {...register('esthrs')} disabled={layout['esthrs'].readonly}/>

              <EAMInput {...register('actstartdate')} disabled={layout['actstartdate'].readonly}/>

              <EAMInput {...register('actenddate')} disabled={layout['actenddate'].readonly}/>

              <EAMInput {...register('percentcomplete')} disabled={layout['percentcomplete'].readonly}/>
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

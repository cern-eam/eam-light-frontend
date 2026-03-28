import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import "./AddActivityDialog.css";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import KeyCode from "eam-components/dist/enums/KeyCode";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import LightDialog from "@/ui/components/LightDialog";
import EAMTimePicker from "eam-components/dist/ui/components/inputs-ng/EAMTimePicker";
import { getOrg } from "../../../../../hooks/tools";
import useEntity from "../../../../../hooks/useEntity";
import { bookLabourPropertiesMap } from "../../WorkorderTools";
import { fromEAMDate, toEAMDate, toEAMNumber } from "../../../EntityTools";
import EAMInput from "../../../../components/EAMInput";

function AddBookLabourDialog(props) {
  const {workorderNumber, workOrder, onChange, activities, open, defaultEmployee} = props;

  if (!open) {
      return null; 
  }

  const {
    entity: laborBooking,
    saveHandler,
    updateEntityProperty: updateBookLabourProperty,
    register,
    loading,
    handleError,
  } = useEntity({
    WS: {
      create: WSWorkorders.createBookingLabour,
      new: () => WSWorkorders.initBookingLabour(workOrder, activities, defaultEmployee),
    },
    postActions: {
      create: postCreate,
    },
    handlers: {
      "ACTIVITYID.ACTIVITYCODE.value": activityCodeChanged,
    },
    tabCode: "BOO",
    screenProperty: "workOrderScreen",
    explicitIdentifier: ``,
    layoutPropertiesMap: bookLabourPropertiesMap,
    pageMode: false
  });

  if (!laborBooking) {
    return null;
  }

  function activityCodeChanged({ ['ACTIVITYID.ACTIVITYCODE.value']: activityCode }) {
    if (!activityCode) return
    
    updateBookLabourProperty({
      'TRADEID.TRADECODE': activities.find(a => a.activityCode === activityCode)?.tradeCode
    });
  }


  function postCreate() {
    onChange();
    handleClose();

    WSWorkorders.getWorkOrder.bind(null, workorderNumber, getOrg()) //TODO do we really have to read the WO?
      .then((result) => {
        const workorder = result.body.Result.ResultData.WorkOrder;
        props.updateWorkorderProperty({
          "recordid": workorder.recordid,
          "STARTDATE": workorder.STARTDATE,
        });
      })
      .catch((error) => {
        handleError(error);
      });
  }

  let handleClose = () => {
    props.onClose();
  };

 
  let onKeyDown = (e) => {
    if (e.keyCode === KeyCode.ENTER) {
      e.stopPropagation();
      handleSave();
    }
  };

  //
  // HANDLE HOURS WORKED
  //

  let formatHoursWorkedValue = (value) => parseFloat(value).toFixed(6).toString();

  let updateHourseWorked = (startTime, endTime) => {
    const timeWorked = endTime.getHours() * 60 + endTime.getMinutes() - (startTime.getHours() * 60 + startTime.getMinutes());
    updateBookLabourProperty({ 'HOURSBOOKED': toEAMNumber(formatHoursWorkedValue(timeWorked / 60 || "0")) });
  };

  function startEndTimeChanged(value) {
    if (!laborBooking.ACTUALSTARTTIME || !laborBooking.ACTUALENDTIME) {
      return
    }

    const startTime = new Date(fromEAMDate(laborBooking.ACTUALSTARTTIME));
    const endTime = new Date(fromEAMDate(laborBooking.ACTUALENDTIME));
    
    if ( (startTime.getTime() > endTime.getTime())) {
      updateBookLabourProperty({
        'ACTUALENDTIME': toEAMDate(startTime),
        'HOURSBOOKED': toEAMNumber(0),
      })
      return
    }

    updateHourseWorked(startTime, endTime);
  };

  function hoursWorkedChanged({['HOURSBOOKED']: hoursWorked}) {
    if (!laborBooking.ACTUALSTARTTIME || !hoursWorked || isNaN(hoursWorked)) {
      return;
    }
    const startTime = new Date(fromEAMDate(laborBooking.ACTUALSTARTTIME));
    const endTime = new Date(startTime.getTime() + parseFloat(hoursWorked) * 60 * 60_000);
    updateBookLabourProperty({ "ACTUALENDTIME": toEAMDate(endTime) });
  }

  return (
    <div onKeyDown={onKeyDown}>
      <LightDialog
        fullWidth
        id="addBookLabourDialog"
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Book Labor</DialogTitle>

        <DialogContent id="content">
          <div>
            <BlockUi tag="div" blocking={loading}>
              <EAMSelect {...register('booactivity')}
                options={props.activities.map((activity) => {
                  return {
                    code: activity.activityCode,
                    desc: activity.activityNote,
                  };
                })}
              />

              <EAMInput {...register('employee')} />

              <EAMInput {...register('department')} />

              <EAMInput {...register('datework')} />

              <EAMInput {...register('octype')} />

              <EAMInput {...register('hrswork', null, hoursWorkedChanged)}
                            renderDependencies={[laborBooking.ACTUALSTARTTIME, laborBooking.ACTUALENDTIME]} />
              
              <EAMTimePicker {...register('actstarttime', null, startEndTimeChanged)}
                            renderDependencies={[laborBooking.ACTUALENDTIME, laborBooking.HOURSBOOKED]} />

              <EAMTimePicker {...register('actendtime', null, startEndTimeChanged)}
                            renderDependencies={[laborBooking.ACTUALSTARTTIME, laborBooking.HOURSBOOKED]} />

              <EAMInput {...register('emptrade')} />
            </BlockUi>
          </div>
        </DialogContent>

        <DialogActions>
          <div>
            <Button onClick={handleClose} color="primary" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={saveHandler} color="primary" disabled={loading}>
              Save
            </Button>
          </div>
        </DialogActions>
      </LightDialog>
    </div>
  );
}

export default AddBookLabourDialog;

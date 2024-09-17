import * as React from "react";
import EAMDateTimePicker from "eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../tools/WS";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";

const WorkorderScheduling = (props) => {
  const { workOrderLayout, register } = props;

  if (
    "H" === workOrderLayout.fields.reqstartdate.attribute &&
    "H" === workOrderLayout.fields.reqenddate.attribute &&
    "H" === workOrderLayout.fields.schedstartdate.attribute &&
    "H" === workOrderLayout.fields.schedenddate.attribute &&
    "H" === workOrderLayout.fields.datecompleted.attribute &&
    "H" === workOrderLayout.fields.startdate.attribute &&
    "H" === workOrderLayout.fields.reportedby.attribute &&
    "H" === workOrderLayout.fields.assignedto.attribute &&
    "H" === workOrderLayout.fields.udfchar17.attribute
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <div style={{ display: "flex", flex: "1 1 auto" }}>
        <EAMAutocomplete
          {...register("createdby", "createdBy", "createdByDesc")}
        />
        <EAMDatePicker {...register("datecreated", "createdDate")} />
      </div>

      <EAMAutocomplete
        {...register("reportedby", "reportedBy", "reportedByDesc")}
        autocompleteHandler={WS.autocompleteEmployee}
      />

      <EAMAutocomplete
        {...register("assignedto", "assignedTo", "assignedToDesc")}
        barcodeScanner
        autocompleteHandler={WS.autocompleteEmployee}
      />

      <EAMAutocomplete
        {...register("schedgroup", "assignedBy")}
        barcodeScanner
        autocompleteHandler={WS.autocompleteSupervisor}
      />

      <EAMDatePicker {...register("reqstartdate", "requestedStartDate")} />

      <EAMDatePicker {...register("reqenddate", "requestedEndDate")} />

      <EAMDatePicker {...register("schedstartdate", "scheduledStartDate")} />

      <EAMDatePicker {...register("schedenddate", "scheduledEndDate")} />

      <EAMDateTimePicker {...register("startdate", "startDate")} />

      <EAMDateTimePicker {...register("datecompleted", "completedDate")} />

      <EAMDateTimePicker {...register("datereported", "reportedDate")} />

      <EAMUDF
        {...register(
          "udfchar17",
          `userDefinedFields.udfchar17`,
          `userDefinedFields.udfchar17Desc`
        )}
      />

      <EAMUDF
        {...register(
          "udfchar19",
          `userDefinedFields.udfchar19`,
          `userDefinedFields.udfchar19Desc`
        )}
      />
    </React.Fragment>
  );
};

export default WorkorderScheduling;

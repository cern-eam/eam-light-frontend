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

      <EAMAutocomplete {...register("reportedby")} />

      <EAMAutocomplete {...register("assignedto")} barcodeScanner/>

      <EAMAutocomplete {...register("schedgroup", "assignedBy")} barcodeScanner />

      <EAMDatePicker {...register("reqstartdate")} />

      <EAMDatePicker {...register("reqenddate")} />

      <EAMDatePicker {...register("schedstartdate")} />

      <EAMDatePicker {...register("schedenddate")} />

      <EAMDateTimePicker {...register("startdate")} />

      <EAMDateTimePicker {...register("datecompleted")} />

      <EAMDateTimePicker {...register("datereported")} />

      <EAMUDF {...register("udfchar17")}/>

      <EAMUDF {...register("udfchar19")}/>

    </React.Fragment>
  );
};

export default WorkorderScheduling;

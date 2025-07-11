import * as React from "react";
import EAMDateTimePicker from "eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

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
        <EAMTextField {...register("createdby")} />
        <EAMDatePicker {...register("datecreated")} />
      </div>

      <EAMComboAutocomplete {...register("reportedby")} />

      <EAMComboAutocomplete {...register("assignedto")} barcodeScanner/>

      <EAMComboAutocomplete {...register("schedgroup")} barcodeScanner />

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

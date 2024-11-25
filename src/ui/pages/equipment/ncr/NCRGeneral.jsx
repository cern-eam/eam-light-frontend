import * as React from "react";
import WS from "../../../../tools/WS";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isMultiOrg } from "@/ui/pages/EntityTools";

const NCRGeneral = (props) => {
  const {
    ncrLayout,
    register,
    ncr,
    EAMInputField
  } = props;
  
  return (
    <React.Fragment>
      <EAMTextField {...register("description", "description")} />
      <EAMInputField layoutKey="equipment" valueKey="equipmentCode"
        link={() => ncr.equipmentCode ? "/equipment/" + ncr.equipmentCode : null
        }
      />

      <EAMInputField layoutKey="location" valueKey="locationCode" />
      <EAMInputField layoutKey="department" valueKey="department"/>
      <EAMInputField  layoutKey="type" valueKey="typeCode" select={true} />
      <EAMTextField {...register("status", "statusCode")} />
      <EAMInputField layoutKey="class" valueKey="classCode" />
      <EAMTextField {...register("severity", "severity")} />
      <EAMTextField {...register("importance", "importance")} />
      <EAMTextField {...register("nonconformitynote", "nonConformityNote")} />
    </React.Fragment>
  );
};

export default NCRGeneral;

import * as React from "react";
import WS from "../../../../tools/WS";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isMultiOrg } from "@/ui/pages/EntityTools";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";

const NCRGeneral = (props) => {
  const {
    register,
    ncr
  } = props;
  
  return (
    <React.Fragment>
      <EAMTextField {...register("description", "description")} />
      <EAMAutocomplete {...register("equipment", "equipmentCode")}
      link={() =>
        ncr.equipmentCode
          ? "/equipment/" + ncr.equipmentCode
          : null
      }
      
      />
      <EAMAutocomplete {...register("location", "locationCode")} />
      <EAMAutocomplete {...register("department", "department")} />
      <EAMSelect {...register("type", "typeCode")} />
      <EAMTextField {...register("status", "statusCode")} />
      <EAMTextField {...register("class", "classCode")} />
      <EAMTextField {...register("severity", "severity")} />
      <EAMTextField {...register("importance", "importance")} />
      <EAMTextField {...register("nonconformitynote", "nonConformityNote")} />
    </React.Fragment>
  );
};

export default NCRGeneral;

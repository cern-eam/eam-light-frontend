import * as React from "react";
import WS from "../../../../tools/WS";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isMultiOrg } from "@/ui/pages/EntityTools";

const NCRGeneral = (props) => {
  const {
    equipment,
    newEntity,
    statuses,
    register,
    userData,
    screenCode,
    screenPermissions,
    ncr
  } = props;
  console.log("ncr", ncr)
  return (
    <React.Fragment>
      <EAMTextField {...register("description", "description")} />
      <EAMTextField {...register("equipment", "equipmentCode")}
      link={() =>
        ncr.equipmentCode
          ? "/equipment/" + ncr.equipmentCode
          : null
      }
      
      />
      <EAMTextField {...register("location", "locationCode")} />
      <EAMTextField {...register("department", "department")} />
      <EAMTextField {...register("type", "typeCode")} />
      <EAMTextField {...register("status", "statusCode")} />
      <EAMTextField {...register("class", "classCode")} />
      <EAMTextField {...register("severity", "severity")} />
      <EAMTextField {...register("importance", "importance")} />
      <EAMTextField {...register("nonconformitynote", "nonConformityNote")} />
    </React.Fragment>
  );
};

export default NCRGeneral;

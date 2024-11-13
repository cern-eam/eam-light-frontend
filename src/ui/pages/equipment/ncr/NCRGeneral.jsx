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
  } = props;
  return (
    <React.Fragment>
      <EAMTextField {...register("description", "description")} />
      <EAMTextField {...register("equipment", "equipmentCode")} />
      <EAMTextField {...register("location", "locationCode")} />
      <EAMTextField {...register("department", "department")} />
      <EAMTextField {...register("type", "typeCode")} />
      <EAMTextField {...register("status", "statusCode")} />
      <EAMTextField {...register("class", "classCode")} />
    </React.Fragment>
  );
};

export default NCRGeneral;

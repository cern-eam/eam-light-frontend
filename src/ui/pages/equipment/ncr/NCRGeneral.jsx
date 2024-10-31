import * as React from "react";
import WS from "../../../../tools/WS";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import {  isMultiOrg } from "@/ui/pages/EntityTools";

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


    </React.Fragment>
  );
};

export default NCRGeneral;

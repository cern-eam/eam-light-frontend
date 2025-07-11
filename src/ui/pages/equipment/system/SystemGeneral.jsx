import * as React from "react";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import StatusRow from "../../../components/statusrow/StatusRow";
import { isDepartmentReadOnly, isMultiOrg } from "@/ui/pages/EntityTools";
import { autocompleteDepartment, readStatuses } from "../../../../tools/WSGrids";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const SystemGeneral = (props) => {
  const {
    equipment,
    id,
    newEntity,
    register,
    userData,
    screenCode,
    screenPermissions,
  } = props;

  return (
    <React.Fragment>
      {isMultiOrg && newEntity && (<EAMSelect {...register("organization")} />)}

      {newEntity && <EAMTextField {...register("equipmentno")} />}

      <EAMTextField {...register("alias")} />

      <EAMTextField {...register("udfchar45")} />

      <EAMTextField {...register("equipmentdesc")} />

      <EAMComboAutocomplete
        {...register("department")}
                autocompleteHandler={autocompleteDepartment}
      />

      <EAMSelect
        {...register("assetstatus")}
        disabled={
          isDepartmentReadOnly(equipment.departmentCode, userData) ||
          !screenPermissions.updateAllowed
        }
        autocompleteHandler={readStatuses}
        autocompleteHandlerParams={["OBJ", newEntity, equipment.STATUS.STATUSCODE]}
      />

      <StatusRow
        entity={equipment}
        entityType={"equipment"}
        screenCode={screenCode}
        code={id?.code}
        org={id?.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default SystemGeneral;

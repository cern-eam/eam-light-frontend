import React, { Component } from "react";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import { isDepartmentReadOnly, isMultiOrg } from "@/ui/pages/EntityTools";
import { autocompleteDepartment, readStatuses } from "../../../../tools/WSGrids";

const PositionGeneral = (props) => {
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
      {isMultiOrg && newEntity && (
        <EAMSelect
          {...register("organization", "organization")}
          autocompleteHandler={WS.getOrganizations}
          autocompleteHandlerParams={[screenCode]}
        />
      )}

      {newEntity && <EAMTextField {...register("equipmentno")} />}

      <EAMTextField {...register("alias")} />

      <EAMTextField {...register("udfchar45")} />

      <EAMTextField {...register("equipmentdesc")} />

      <EAMAutocomplete
        {...register("department")}
          autocompleteHandler={autocompleteDepartment}
          autocompleteHandlerParams={["*"]}
      />

      <EAMSelect
        {...register("assetstatus")}
        disabled={
          isDepartmentReadOnly(equipment.departmentCode, userData) ||
          !screenPermissions.updateAllowed
        }
        autocompleteHandler={readStatuses}
        autocompleteHandlerParams={["OBJ", newEntity, equipment.statusCode]}
      />

      <StatusRow
        entity={equipment}
        entityType={"equipment"}
        screenCode={screenCode}
        code={id.code}
        org={id.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default PositionGeneral;

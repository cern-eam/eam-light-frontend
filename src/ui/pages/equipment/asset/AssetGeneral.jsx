import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isDepartmentReadOnly, isMultiOrg } from "@/ui/pages/EntityTools";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { readStatuses, readUserCodes } from "../../../../tools/WSGrids";

const AssetGeneral = (props) => {
  const {
    equipment,
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

      {newEntity && <EAMTextField {...register("equipmentno", "code")} />}

      <EAMTextField {...register("alias", "alias")} barcodeScanner />

      <EAMUDF {...register("udfchar45", "userDefinedFields.udfchar45")} />

      <EAMTextField {...register("equipmentdesc", "description")} />

      <EAMAutocomplete
        {...register("department", "departmentCode", "departmentDesc")}
        autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}
      />

      <EAMSelect
        {...register("assetstatus", "statusCode")}
        disabled={
          isDepartmentReadOnly(equipment.departmentCode, userData) ||
          !screenPermissions.updateAllowed
        }
        autocompleteHandler={readStatuses}
        autocompleteHandlerParams={["OBJ", newEntity, equipment.statusCode]}
      />

      <EAMSelect
        {...register("state", "stateCode")}
        autocompleteHandler={readUserCodes}
        autocompleteHandlerParams={["OBSA"]}
      />
      <StatusRow
        entity={equipment}
        entityType={"equipment"}
        screenCode={screenCode}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default AssetGeneral;

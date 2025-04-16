import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isDepartmentReadOnly, isMultiOrg } from "@/ui/pages/EntityTools";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { autocompleteDepartment, readStatuses, readUserCodes } from "../../../../tools/WSGrids";

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

      {newEntity && <EAMTextField {...register("equipmentno")} />}

      <EAMTextField {...register("alias")} barcodeScanner />

      <EAMUDF {...register("udfchar45")} />

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
        autocompleteHandlerParams={["OBJ", newEntity, equipment.STATUS.STATUSCODE]}
      />

      <EAMSelect
        {...register("state")}
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

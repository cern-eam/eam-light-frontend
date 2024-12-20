import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";

const AssetGeneral = (props) => {
  const { location, locationLayout, newEntity, register } = props;

  return (
    <React.Fragment>
      {newEntity && <EAMTextField {...register("equipmentno", "code")} />}

      <EAMTextField {...register("udfchar45", "userDefinedFields.udfchar45")} />

      <EAMTextField {...register("equipmentdesc", "description")} />

      <EAMAutocomplete
        {...register("department", "departmentCode", "departmentDesc")}
        autocompleteHandler={WS.autocompleteDepartment}
      />

      <StatusRow
        entity={location}
        entityType={"equipment"}
        screenCode={locationLayout.fields.safety.pageName}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default AssetGeneral;

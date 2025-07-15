import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import StatusRow from "../../../components/statusrow/StatusRow";
import { autocompleteDepartment } from "../../../../tools/WSGrids";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const AssetGeneral = (props) => {
  const { location, locationLayout, newEntity, register, id } = props;

  return (
    <React.Fragment>
      {newEntity && <EAMTextField {...register("equipmentno")} />}

      <EAMTextField {...register("udfchar45")} />

      <EAMTextField {...register("equipmentdesc")} />

      <EAMComboAutocomplete
        {...register("department")}
        autocompleteHandler={autocompleteDepartment}
      />

      {!newEntity &&
      <StatusRow
        entity={location}
        entityType={"equipment"}
        screenCode={locationLayout.fields.safety.pageName}
        code={id?.code}
        org={id?.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />}
      
    </React.Fragment>
  );
};

export default AssetGeneral;

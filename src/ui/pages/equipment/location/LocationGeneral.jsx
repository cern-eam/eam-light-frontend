import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import { autocompleteDepartment } from "../../../../tools/WSGrids";

const AssetGeneral = (props) => {
  const { location, locationLayout, newEntity, register, id } = props;

  return (
    <React.Fragment>
      {newEntity && <EAMTextField {...register("equipmentno")} />}

      <EAMTextField {...register("udfchar45")} />

      <EAMTextField {...register("equipmentdesc")} />

      <EAMAutocomplete
        {...register("department")}
        autocompleteHandler={autocompleteDepartment}
        autocompleteHandlerParams={["*"]}
      />

      <StatusRow
        entity={location}
        entityType={"equipment"}
        screenCode={locationLayout.fields.safety.pageName}
        code={id?.code}
        org={id?.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default AssetGeneral;

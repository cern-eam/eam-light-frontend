import * as React from "react";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import WS from "../../../tools/WS";
import StatusRow from "../../components/statusrow/StatusRow";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { isMultiOrg } from "../EntityTools";
import { getPartTrackingMethods } from "../../../tools/WSParts";

const PartGeneral = (props) => {
  const { part, newEntity, register, screenCode, id } = props;

  return (
    <React.Fragment>
      {isMultiOrg && newEntity && (
        <EAMSelect
          {...register("organization", "organization")}
          autocompleteHandler={WS.getOrganizations}
          autocompleteHandlerParams={[screenCode]}
        />
      )}

      {newEntity && <EAMTextField {...register("partcode")} />}

      <EAMTextField {...register("description")} />

      <EAMAutocomplete {...register("class")} />

      <EAMAutocomplete {...register("category")} />

      <EAMAutocomplete {...register("uom")} />

      <EAMSelect {...register("trackingtype")} autocompleteHandler={getPartTrackingMethods}/>

      <EAMAutocomplete
        {...register("commoditycode")}
      />

      <EAMCheckbox {...register("trackbyasset")} />

      <EAMCheckbox {...register("repairablespare")} />

      <StatusRow
        entity={part}
        entityType={"part"}
        screenCode={screenCode}
        code={id?.code}
        org={id?.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />
    </React.Fragment>
  );
};

export default PartGeneral;

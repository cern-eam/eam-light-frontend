import * as React from "react";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import StatusRow from "../../components/statusrow/StatusRow";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { isMultiOrg } from "../EntityTools";
import { getPartTrackingMethods } from "../../../tools/WSParts";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const PartGeneral = (props) => {
  const { part, newEntity, register, screenCode, id } = props;

  return (
    <React.Fragment>
      {isMultiOrg && newEntity && (<EAMSelect {...register("organization")} />)}

      <EAMTextField {...register("partcode")} hidden={!newEntity}/>

      <EAMTextField {...register("description")} />

      <EAMComboAutocomplete {...register("class")} />

      <EAMComboAutocomplete {...register("category")} />

      <EAMComboAutocomplete {...register("uom")} />

      <EAMComboAutocomplete {...register("trackingtype")} />

      <EAMComboAutocomplete {...register("commoditycode")} />

      <EAMCheckbox {...register("trackbyasset")} />

      <EAMCheckbox {...register("repairablespare")} />

      {!newEntity &&
      <StatusRow
        entity={part}
        entityType={"part"}
        screenCode={screenCode}
        code={id?.code}
        org={id?.org}
        style={{ marginTop: "10px", marginBottom: "-10px" }}
      />}
      
    </React.Fragment>
  );
};

export default PartGeneral;

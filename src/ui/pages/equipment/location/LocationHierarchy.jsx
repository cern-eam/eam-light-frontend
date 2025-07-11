import * as React from "react";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const LocationHierarchy = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMComboAutocomplete {...register("parentlocation", "ParentLocationID.LOCATIONCODE")} />

      <EAMUDF {...register("udfchar11")} />
    </React.Fragment>
  );
};

export default LocationHierarchy;

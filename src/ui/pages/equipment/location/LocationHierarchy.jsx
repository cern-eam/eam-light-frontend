import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import * as React from "react";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import WS from "../../../../tools/WS";

const LocationHierarchy = (props) => {
  const { location, locationLayout, updateEquipmentProperty, register } = props;

  return (
    <React.Fragment>
      <EAMAutocomplete
        {...register(
          "parentlocation",
          "hierarchyLocationCode",
          "hierarchyLocationDesc"
        )}
        autocompleteHandler={WS.autocompleteLocation}
      />

      <EAMUDF {...register("udfchar11", "userDefinedFields.udfchar11")} />
    </React.Fragment>
  );
};

export default LocationHierarchy;

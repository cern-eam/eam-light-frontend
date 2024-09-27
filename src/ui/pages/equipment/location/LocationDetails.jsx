import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";

const LocationDetails = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMAutocomplete
        {...register("class", "classCode", "classDesc")}
        autocompleteHandler={WS.autocompleteClass}
        autocompleteHandlerParams={["LOC"]}
      />

      <EAMTextField {...register("costcode", "costCode")} />

      <EAMCheckbox {...register("safety", "safety")} />

      <EAMCheckbox {...register("outofservice", "outOfService")} />
    </React.Fragment>
  );
};

export default LocationDetails;

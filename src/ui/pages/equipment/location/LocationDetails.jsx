import * as React from "react";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";

const LocationDetails = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMAutocomplete {...register("class")} />

      <EAMTextField {...register("costcode")} />

      <EAMCheckbox {...register("safety")} />

      <EAMCheckbox {...register("outofservice")} />
    </React.Fragment>
  );
};

export default LocationDetails;

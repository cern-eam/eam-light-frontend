import * as React from "react";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const LocationDetails = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMComboAutocomplete {...register("class")} />

      <EAMComboAutocomplete {...register("costcode")} />

      <EAMCheckbox {...register("safety")} />

      <EAMCheckbox {...register("outofservice")} />
    </React.Fragment>
  );
};

export default LocationDetails;

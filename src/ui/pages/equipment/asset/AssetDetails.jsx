import * as React from "react";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { readUserCodes } from "../../../../tools/WSGrids";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const AssetDetails = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMComboAutocomplete {...register("class")}/>

      <EAMComboAutocomplete {...register("category")}/>

      <EAMComboAutocomplete {...register("costcode")}/>

      <EAMDatePicker {...register("commissiondate")} />

      <EAMComboAutocomplete {...register("assignedto")} />

      <EAMSelect  {...register("criticality")}
        autocompleteHandler={readUserCodes}
        autocompleteHandlerParams={["OBCR"]}
      />

      <EAMTextField {...register("equipmentvalue")} />

      <EAMComboAutocomplete {...register("manufacturer")} />

      <EAMTextField {...register("serialnumber")} />

      <EAMTextField {...register("model")} />

      <EAMComboAutocomplete {...register("part")} />

      <EAMTextField {...register("store")}  disabled={true} />

      <EAMTextField {...register("bin")} disabled={true} />

    </React.Fragment>
  );
};

export default AssetDetails;

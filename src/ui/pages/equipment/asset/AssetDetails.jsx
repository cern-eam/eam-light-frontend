import * as React from "react";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { readUserCodes } from "../../../../tools/WSGrids";

const AssetDetails = (props) => {
  const { register } = props;

  return (
    <React.Fragment>
      <EAMAutocomplete {...register("class")}/>

      <EAMAutocomplete {...register("category")}/>

      <EAMAutocomplete {...register("costcode")}/>

      <EAMDatePicker {...register("commissiondate")} />

      <EAMAutocomplete {...register("assignedto")} />

      <EAMSelect  {...register("criticality")}
        autocompleteHandler={readUserCodes}
        autocompleteHandlerParams={["OBCR"]}
      />

      <EAMTextField {...register("equipmentvalue")} />

      <EAMAutocomplete {...register("manufacturer")} />

      <EAMTextField {...register("serialnumber")} />

      <EAMTextField {...register("model")} />

      <EAMAutocomplete {...register("part")} />

      <EAMTextField {...register("store")}  disabled={true} />

      <EAMTextField {...register("bin")} disabled={true} />

    </React.Fragment>
  );
};

export default AssetDetails;

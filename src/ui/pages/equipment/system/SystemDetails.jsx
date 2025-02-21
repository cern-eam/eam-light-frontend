import * as React from "react";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WS from "../../../../tools/WS";
import WSEquipment from "../../../../tools/WSEquipment";
import { onCategoryChange } from "../EquipmentTools";
import { readUserCodes } from "../../../../tools/WSGrids";

const SystemDetails = (props) => {
  const { equipment, register, updateEquipmentProperty } = props;

  return (
    <React.Fragment>
      <EAMAutocomplete
        {...register("class", "classCode", "classDesc")}

      />

      <EAMAutocomplete
        {...register(
          "category",
          "categoryCode",
          "categoryDesc",
          null,
          (categoryCode) =>
            onCategoryChange(categoryCode, updateEquipmentProperty)
        )}
        autocompleteHandler={WSEquipment.autocompleteEquipmentCategory}
        autocompleteHandlerParams={[equipment.classCode]}
      />

      <EAMDatePicker {...register("commissiondate", "comissionDate")} />

      <EAMAutocomplete
        {...register("assignedto", "assignedTo", "assignedToDesc")}
        autocompleteHandler={WS.autocompleteEmployee}
      />

      <EAMSelect
        {...register("criticality", "criticality")}
        autocompleteHandler={readUserCodes}
        autocompleteHandlerParams={["OBCR"]}
      />

      <EAMAutocomplete
        // TODO: manufacturerDesc comes 'null' in initial response
        {...register("manufacturer", "manufacturerCode", "manufacturerDesc")}
        autocompleteHandler={WSEquipment.autocompleteManufacturer}
      />

      <EAMTextField {...register("serialnumber", "serialNumber")} />

      <EAMTextField {...register("model", "model")} />
    </React.Fragment>
  );
};

export default SystemDetails;

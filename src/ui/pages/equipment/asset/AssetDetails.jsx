import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import EAMDatePicker from "eam-components/dist/ui/components/inputs-ng/EAMDatePicker";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { onCategoryChange } from "../EquipmentTools";
import { readUserCodes } from "../../../../tools/WSGrids";

const AssetDetails = (props) => {
  const { equipment, updateEquipmentProperty, register } = props;

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

      <EAMAutocomplete
        {...register("costcode", "costCode", "costCodeDesc")}
        autocompleteHandler={WSEquipment.autocompleteCostCode}
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

      <EAMTextField {...register("equipmentvalue", "equipmentValue")} />

      <EAMAutocomplete
        {...register("manufacturer", "manufacturerCode", "manufacturerDesc")}
        autocompleteHandler={WSEquipment.autocompleteManufacturer}
      />

      <EAMTextField {...register("serialnumber", "serialNumber")} />

      <EAMTextField {...register("model", "model")} />

      <EAMAutocomplete
        {...register("part", "partCode", "partDesc")}
        autocompleteHandler={WSEquipment.autocompleteEquipmentPart}
        link={() => (equipment.partCode ? "/part/" + equipment.partCode : null)}
      />

      <EAMAutocomplete
        {...register("store", "storeCode", "storeDesc")}
        autocompleteHandler={WSEquipment.autocompleteEquipmentStore}
        disabled={true}
      />

      <EAMAutocomplete
        {...register("bin", "bin", "binDesc")}
        autocompleteHandler={WSEquipment.autocompleteEquipmentBin}
        autocompleteHandlerParams={[equipment.storeCode]}
        disabled={true}
      />
    </React.Fragment>
  );
};

export default AssetDetails;

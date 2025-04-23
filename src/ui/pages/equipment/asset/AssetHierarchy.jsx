import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import Dependency from "../components/Dependency";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import {
  onChangeDependentInput,
  isDependencySet,
  COST_ROLL_UP_CODES,
  updateCostRollUpProperty,
} from "../EquipmentTools";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import { getAssetHierarchyAssetDependent, getAssetHierarchyCode, getPositionHierarchyCode, getAssetHierarchyObject, ParentDependencyTypes, getDependencyType, getPrimarySystemHierarchyCode } from "./assethierarchytools";
import { Code } from "@mui/icons-material";

const DEPENDENCY_KEYS = {
  asset: "hierarchyAssetDependent",
  position: "hierarchyPositionDependent",
  primarySystem: "hierarchyPrimarySystemDependent",
};

const AssetHierarchy = (props) => {
  const {
    equipment,
    updateEquipmentProperty,
    register,
    readOnly,
    showWarning,
    assetLayout
  } = props;

  const renderDependenciesForDependencyInputs = [
    equipment[DEPENDENCY_KEYS.asset],
    equipment[DEPENDENCY_KEYS.position],
    equipment[DEPENDENCY_KEYS.primarySystem],
  ];
  
  return (
    <React.Fragment>
      <EAMUDF {...register("udfchar13")} />

      <EAMUDF {...register("udfchar11")} />

      <EAMAutocomplete
      {...processElementInfo(assetLayout.fields.parentasset)}
      value={getAssetHierarchyCode(equipment)
      }

        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onSelect={value => {
          let hierarchy = getAssetHierarchyObject({parentAssetCode: value.code, parentAssetOrg: value.org}, equipment.AssetParentHierarchy)
          updateEquipmentProperty("AssetParentHierarchy", hierarchy)
        }}
        barcodeScanner
        endAdornment={
          <Dependency
            onChangeHandler={(event) => {
              let hierarchy = getAssetHierarchyObject({dependencyType: event.target.checked ? ParentDependencyTypes.ASSET : ParentDependencyTypes.NONE}, equipment.AssetParentHierarchy);
              updateEquipmentProperty("AssetParentHierarchy", hierarchy);
            }}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.ASSET}
            disabled={!getAssetHierarchyCode(equipment)}
          />
        }
        renderDependencies={[equipment.AssetParentHierarchy]}
      />

      <EAMAutocomplete
      {...processElementInfo(assetLayout.fields.position)}
        value = {getPositionHierarchyCode(equipment) }
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        onSelect={value => {
          let hierarchy = getAssetHierarchyObject({parentPositionCode: value.code, parentPositionOrg: value.org}, equipment.AssetParentHierarchy)
          updateEquipmentProperty("AssetParentHierarchy", hierarchy)
        }}
        endAdornment={
          <Dependency
            onChangeHandler={(event) => {
              let hierarchy = getAssetHierarchyObject({dependencyType: event.target.checked ? ParentDependencyTypes.POSITION : ParentDependencyTypes.NONE}, equipment.AssetParentHierarchy);
              updateEquipmentProperty("AssetParentHierarchy", hierarchy);
            }}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.POSITION}
            disabled={!getPositionHierarchyCode(equipment)}
          />
        }
        renderDependencies={[equipment.AssetParentHierarchy]}
      />

      <EAMAutocomplete
      {...processElementInfo(assetLayout.fields.primarysystem)}
      value = {getPrimarySystemHierarchyCode(equipment)}

        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        onSelect={value => {
          let hierarchy = getAssetHierarchyObject({parentPrimarySystemCode: value.code, parentPrimarySystemOrg: value.org}, equipment.AssetParentHierarchy)
          updateEquipmentProperty("AssetParentHierarchy", hierarchy)
        }}
        endAdornment={
          <Dependency
            onChangeHandler={(event) => {
              let hierarchy = getAssetHierarchyObject({dependencyType: event.target.checked ? ParentDependencyTypes.PRIMARYSYSTEM : ParentDependencyTypes.NONE}, equipment.AssetParentHierarchy);
              updateEquipmentProperty("AssetParentHierarchy", hierarchy);
            }}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getPrimarySystemHierarchyCode(equipment)}
          />
        }
        renderDependencies={[equipment.AssetParentHierarchy]}
      />

      <EAMAutocomplete
        {...register( "location")}
        disabled={readOnly || isDependencySet(equipment, DEPENDENCY_KEYS)}
      />
    </React.Fragment>
  );
};

export default AssetHierarchy;

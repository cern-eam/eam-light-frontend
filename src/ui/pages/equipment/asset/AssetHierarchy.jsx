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
      value={
        get(equipment, 'AssetParentHierarchy.AssetDependency.DEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.PositionDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTASSET.ASSETID.EQUIPMENTCODE')
      }
        // {...register(
        //   "parentasset",
        //   "hierarchyAssetCode",
        //   "hierarchyAssetDesc",
        //   "hierarchyAssetOrg",
        //   (value) => {
        //     onChangeDependentInput(
        //       value,
        //       DEPENDENCY_KEYS.asset,
        //       DEPENDENCY_KEYS,
        //       equipment,
        //       updateEquipmentProperty,
        //       showWarning
        //     );
        //     updateCostRollUpProperty(
        //       COST_ROLL_UP_CODES.asset,
        //       value,
        //       updateEquipmentProperty
        //     );
        //   }
        // )}
        // barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onSelect={value => console.log('val select', value)}
        // renderDependencies={renderDependenciesForDependencyInputs}
        barcodeScanner
        endAdornment={
          <Dependency
            updateProperty={updateEquipmentProperty}
            value={equipment[DEPENDENCY_KEYS.asset]}
            valueKey={DEPENDENCY_KEYS.asset}
            disabled={!equipment.hierarchyAssetCode}
            dependencyKeysMap={DEPENDENCY_KEYS}
          />
        }
      />

      <EAMAutocomplete
      {...processElementInfo(assetLayout.fields.position)}
      value = {
        get(equipment, 'AssetParentHierarchy.PositionDependency.DEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.AssetDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTPOSITION.POSITIONID.EQUIPMENTCODE')
      }
        // {...register(
        //   "position",
        //   "hierarchyPositionCode",
        //   "hierarchyPositionDesc",
        //   "hierarchyPositionOrg",
        //   (value) => {
        //     onChangeDependentInput(
        //       value,
        //       DEPENDENCY_KEYS.position,
        //       DEPENDENCY_KEYS,
        //       equipment,
        //       updateEquipmentProperty,
        //       showWarning
        //     );
        //     updateCostRollUpProperty(
        //       COST_ROLL_UP_CODES.position,
        //       value,
        //       updateEquipmentProperty
        //     );
        //   }
        // )}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        onSelect={value => console.log('val', value)}
        endAdornment={
          <Dependency
            updateProperty={updateEquipmentProperty}
            value={equipment[DEPENDENCY_KEYS.position]}
            valueKey={DEPENDENCY_KEYS.position}
            disabled={!equipment.hierarchyPositionCode}
            dependencyKeysMap={DEPENDENCY_KEYS}
          />
        }
      />

      <EAMAutocomplete
      {...processElementInfo(assetLayout.fields.primarysystem)}
      value = {
        get(equipment, 'AssetParentHierarchy.PrimarySystemDependency.DEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.AssetDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.PositionDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.SystemDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.LocationDependency.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
        get(equipment, 'AssetParentHierarchy.NonDependentParents.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE')
      }
        // {...register(
        //   "primarysystem",
        //   "hierarchyPrimarySystemCode",
        //   "hierarchyPrimarySystemDesc",
        //   "hierarchyPrimarySystemOrg",
        //   (value) => {
        //     onChangeDependentInput(
        //       value,
        //       DEPENDENCY_KEYS.primarySystem,
        //       DEPENDENCY_KEYS,
        //       equipment,
        //       updateEquipmentProperty,
        //       showWarning
        //     );
        //     updateCostRollUpProperty(
        //       COST_ROLL_UP_CODES.primarySystem,
        //       value,
        //       updateEquipmentProperty
        //     );
        //   }
        // )}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        onSelect={value => console.log('val', value)}
        endAdornment={
          <Dependency
            updateProperty={updateEquipmentProperty}
            value={equipment[DEPENDENCY_KEYS.primarySystem]}
            valueKey={DEPENDENCY_KEYS.primarySystem}
            disabled={!equipment.hierarchyPrimarySystemCode}
            dependencyKeysMap={DEPENDENCY_KEYS}
          />
        }
      />

      <EAMAutocomplete
        {...register(
          "location",
          "hierarchyLocationCode",
          "hierarchyLocationDesc"
        )}
        autocompleteHandler={WSEquipment.autocompleteLocation}
        disabled={readOnly || isDependencySet(equipment, DEPENDENCY_KEYS)}
      />
    </React.Fragment>
  );
};

export default AssetHierarchy;

import * as React from "react";
import { get } from "lodash";
import WSEquipment from "../../../../tools/WSEquipment";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import Dependency from "../components/Dependency";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import {
  getHierarchyObject,
  ParentDependencyTypes,
  getDependencyType,
  getParentAssetCode,
  getParentPositionCode,
  getParentPrimarySystemCode,
} from "../tools/hierarchyTools";
import { createAutocompleteHandler } from "../../../../hooks/tools";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";
import { useInitHierarchyFromQueryParams } from "../tools/useInitHierarchyFromQueryParams";
import { positionLayoutPropertiesMap } from "../tools/EquipmentPropertiesMap";

const PositionHierarchy = ({ equipment, updateEquipmentProperty, register, readOnly, showWarning, positionLayout, newEntity }) => {
  
  useInitHierarchyFromQueryParams({newEntity, equipment, updateEquipmentProperty, hierarchyKey: "PositionParentHierarchy"});

  const onChangeAsset = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentAssetCode: value?.code || '',
      parentAssetOrg:  value?.org  || ''
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangeAssetDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.ASSET : ParentDependencyTypes.NONE
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangePosition = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentPositionCode: value?.code || '',
      parentPositionOrg:  value?.org  || ''
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangePositionDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.POSITION : ParentDependencyTypes.NONE
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangeSystem = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentPrimarySystemCode: value?.code || '',
      parentPrimarySystemOrg:  value?.org  || ''
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangeSystemDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.PRIMARYSYSTEM : ParentDependencyTypes.NONE
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  const onChangeLocation = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentLocationCode:  value?.code || '',
      parentLocationOrg:   value?.org  || '',
      dependencyType:      value?.code ? ParentDependencyTypes.LOCATION : ParentDependencyTypes.NONE
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  return (
    <React.Fragment>
      <EAMTextField {...register("udfchar13")} readonly />
      <EAMTextField {...register("udfchar11")} readonly />

      <EAMComboAutocomplete
        {...processElementInfo(positionLayout.fields.asset)}
        value={getParentAssetCode('PositionParentHierarchy', equipment)}
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onChange={onChangeAsset}
        barcodeScanner
        endAdornment={
          <Dependency
            onChangeHandler={onChangeAssetDependency}
            value={getDependencyType(equipment.PositionParentHierarchy) === ParentDependencyTypes.ASSET}
            disabled={!getParentAssetCode('PositionParentHierarchy', equipment)}
          />
        }
        renderDependencies={[equipment.PositionParentHierarchy]}
      />

      <EAMComboAutocomplete
        {...processElementInfo(positionLayout.fields.parentasset)}
        value={getParentPositionCode('PositionParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        onChange={onChangePosition}
        renderDependencies={[equipment.PositionParentHierarchy]}
        endAdornment={
          <Dependency
            onChangeHandler={onChangePositionDependency}
            value={getDependencyType(equipment.PositionParentHierarchy) === ParentDependencyTypes.POSITION}
            disabled={!getParentPositionCode('PositionParentHierarchy', equipment)}
          />
        }
      />

      <EAMComboAutocomplete
        {...processElementInfo(positionLayout.fields.primarysystem)}
        value={getParentPrimarySystemCode('PositionParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        onChange={onChangeSystem}
        renderDependencies={[equipment.PositionParentHierarchy]}
        endAdornment={
          <Dependency
            onChangeHandler={onChangeSystemDependency}
            value={getDependencyType(equipment.PositionParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getParentPrimarySystemCode('PositionParentHierarchy', equipment)}
          />
        }
      />

      <EAMComboAutocomplete
        {...processElementInfo(positionLayout.fields.location)}
        {...createAutocompleteHandler(positionLayout.fields.location, positionLayout.fields, equipment, positionLayoutPropertiesMap.location?.autocompleteHandlerData)}
        value={get(equipment, 'PositionParentHierarchy.LocationDependency.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'PositionParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly ||
          (getDependencyType(equipment.PositionParentHierarchy) !== ParentDependencyTypes.NONE &&
           getDependencyType(equipment.PositionParentHierarchy) !== ParentDependencyTypes.LOCATION)
        }
        onChange={onChangeLocation}
        renderDependencies={[equipment.PositionParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default PositionHierarchy;

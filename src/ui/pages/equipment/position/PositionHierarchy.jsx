import * as React from "react";
import { get } from "lodash";
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
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
} from "../asset/assethierarchytools";
import { positionLayoutPropertiesMap } from "../EquipmentTools";
import { createAutocompleteHandler } from "../../../../hooks/tools";

const PositionHierarchy = ({ equipment, updateEquipmentProperty, register, readOnly, showWarning, positionLayout }) => {
  
  const onChangeAsset = (value) => {
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

  const onChangePosition = (value) => {
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

  const onChangeSystem = (value) => {
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

  const onChangeLocation = (value) => {
    const hierarchy = getHierarchyObject({
      parentLocationCode:  value?.code || '',
      parentLocationOrg:   value?.org  || '',
      dependencyType:      value?.code ? ParentDependencyTypes.LOCATION : ParentDependencyTypes.NONE
    }, equipment.PositionParentHierarchy);
    updateEquipmentProperty("PositionParentHierarchy", hierarchy);
  };

  return (
    <React.Fragment>
      <EAMTextField {...register("udfchar13", "userDefinedFields.udfchar13")} readonly />
      <EAMTextField {...register("udfchar11", "userDefinedFields.udfchar11")} readonly />

      <EAMAutocomplete
        {...processElementInfo(positionLayout.fields.asset)}
        value={getParentAssetCode('PositionParentHierarchy', equipment)}
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onSelect={onChangeAsset}
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

      <EAMAutocomplete
        {...processElementInfo(positionLayout.fields.parentasset)}
        value={getParentPositionCode('PositionParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        onSelect={onChangePosition}
        renderDependencies={[equipment.PositionParentHierarchy]}
        endAdornment={
          <Dependency
            onChangeHandler={onChangePositionDependency}
            value={getDependencyType(equipment.PositionParentHierarchy) === ParentDependencyTypes.POSITION}
            disabled={!getParentPositionCode('PositionParentHierarchy', equipment)}
          />
        }
      />

      <EAMAutocomplete
        {...processElementInfo(positionLayout.fields.primarysystem)}
        value={getParentPrimarySystemCode('PositionParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        onSelect={onChangeSystem}
        renderDependencies={[equipment.PositionParentHierarchy]}
        endAdornment={
          <Dependency
            onChangeHandler={onChangeSystemDependency}
            value={getDependencyType(equipment.PositionParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getParentPrimarySystemCode('PositionParentHierarchy', equipment)}
          />
        }
      />

      <EAMAutocomplete
        {...processElementInfo(positionLayout.fields.location)}
        {...createAutocompleteHandler(positionLayout.fields.location, positionLayout.fields, equipment, positionLayoutPropertiesMap.location?.autocompleteHandlerData)}
        value={get(equipment, 'PositionParentHierarchy.LocationDependency.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'PositionParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly ||
          (getDependencyType(equipment.PositionParentHierarchy) !== ParentDependencyTypes.NONE &&
           getDependencyType(equipment.PositionParentHierarchy) !== ParentDependencyTypes.LOCATION)
        }
        onSelect={onChangeLocation}
        renderDependencies={[equipment.PositionParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default PositionHierarchy;

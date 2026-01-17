import React, { useEffect } from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from "../components/Dependency";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { get } from "lodash";
import { getHierarchyObject, ParentDependencyTypes, getDependencyType, getParentAssetCode, getParentPositionCode, getParentPrimarySystemCode } from "../tools/hierarchyTools";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { createAutocompleteHandler, getCodeOrg } from "../../../../hooks/tools";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";
import { useInitHierarchyFromQueryParams } from "../tools/useInitHierarchyFromQueryParams";
import { assetLayoutPropertiesMap } from "../tools/EquipmentPropertiesMap";


const AssetHierarchy = (props) => {
  const {
    equipment,
    newEntity,
    updateEquipmentProperty,
    register,
    readOnly,
    assetLayout
  } = props;

  useInitHierarchyFromQueryParams({newEntity, equipment, updateEquipmentProperty, hierarchyKey: "AssetParentHierarchy"});

  const onChangeAsset = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentAssetCode: value?.code || '',
      parentAssetOrg:  value?.org  || ''
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  const onChangeAssetDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.ASSET : ParentDependencyTypes.NONE
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  const onChangePosition = (value, manualInput) => {
    if (!manualInput) return
    console.log('on change position', value)
    const hierarchy = getHierarchyObject({
      parentPositionCode: value?.code || '',
      parentPositionOrg:  value?.org  || ''
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  const onChangePositionDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.POSITION : ParentDependencyTypes.NONE
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  const onChangeSystem = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentPrimarySystemCode: value?.code || '',
      parentPrimarySystemOrg:  value?.org  || ''
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  const onChangeSystemDependency = (event) => {
    const hierarchy = getHierarchyObject({
      dependencyType: event.target.checked ? ParentDependencyTypes.PRIMARYSYSTEM : ParentDependencyTypes.NONE
    }, equipment.AssetParentHierarchy);
  
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };


  const onChangeLocation = (value, manualInput) => {
    if (!manualInput) return

    const hierarchy = getHierarchyObject({
      parentLocationCode:  value?.code || '',
      parentLocationOrg:   value?.org  || '',
      dependencyType:      value?.code ? ParentDependencyTypes.LOCATION : ParentDependencyTypes.NONE
    }, equipment.AssetParentHierarchy);
    updateEquipmentProperty("AssetParentHierarchy", hierarchy);
  };
  
  return (
    <React.Fragment>
      <EAMUDF {...register("udfchar13")} />

      <EAMUDF {...register("udfchar11")} />

      <EAMComboAutocomplete
        {...processElementInfo(assetLayout.fields.parentasset)}
        value={getParentAssetCode('AssetParentHierarchy', equipment)}
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onChange={onChangeAsset}
        barcodeScanner
        endAdornment={
          <Dependency
            onChangeHandler={onChangeAssetDependency}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.ASSET}
            disabled={!getParentAssetCode('AssetParentHierarchy', equipment)}
          />
        }
        renderDependencies={[equipment.AssetParentHierarchy]}
      />

      <EAMComboAutocomplete
        {...processElementInfo(assetLayout.fields.position)}
        value = {getParentPositionCode('AssetParentHierarchy', equipment) }
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        renderDependencies={[equipment.AssetParentHierarchy]}
        onChange={onChangePosition}
        endAdornment={
          <Dependency
            onChangeHandler={onChangePositionDependency}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.POSITION}
            disabled={!getParentPositionCode('AssetParentHierarchy', equipment)}
          />
        }
      />

      <EAMComboAutocomplete
        {...processElementInfo(assetLayout.fields.primarysystem)}
        value = {getParentPrimarySystemCode('AssetParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        renderDependencies={[equipment.AssetParentHierarchy]}
        onChange={onChangeSystem}
        endAdornment={
          <Dependency
            onChangeHandler={onChangeSystemDependency}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getParentPrimarySystemCode('AssetParentHierarchy', equipment)}
          />
        }
      />

      <EAMComboAutocomplete
        {...processElementInfo(assetLayout.fields.location)}
        {...createAutocompleteHandler(assetLayout.fields.location, assetLayout.fields, equipment, assetLayoutPropertiesMap.location?.autocompleteHandlerData)}
        value={get(equipment, 'AssetParentHierarchy.LocationDependency.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'AssetParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || 
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.NONE &&
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.LOCATION
        }
        onChange={onChangeLocation}
        renderDependencies={[equipment.AssetParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default AssetHierarchy;

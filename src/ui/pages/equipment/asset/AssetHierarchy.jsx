import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import Dependency from "../components/Dependency";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { get } from "lodash";
import { getHierarchyObject, ParentDependencyTypes, getDependencyType, getParentAssetCode, getParentPositionCode, getParentPrimarySystemCode } from "./assethierarchytools";
import { assetLayoutPropertiesMap } from "../EquipmentTools";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { createAutocompleteHandler } from "../../../../hooks/tools";


const AssetHierarchy = (props) => {
  const {
    equipment,
    updateEquipmentProperty,
    register,
    readOnly,
    assetLayout
  } = props;


  const onChangeAsset = (value) => {
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
  
  const onChangePosition = (value) => {
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
  
  const onChangeSystem = (value) => {
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


  const onChangeLocation = (value) => {
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

      <EAMAutocomplete
        {...processElementInfo(assetLayout.fields.parentasset)}
        value={getParentAssetCode('AssetParentHierarchy', equipment)}
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["A"]}
        onSelect={onChangeAsset}
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

      <EAMAutocomplete
        {...processElementInfo(assetLayout.fields.position)}
        value = {getParentPositionCode('AssetParentHierarchy', equipment) }
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["P"]}
        renderDependencies={[equipment.AssetParentHierarchy]}
        onSelect={onChangePosition}
        endAdornment={
          <Dependency
            onChangeHandler={onChangePositionDependency}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.POSITION}
            disabled={!getParentPositionCode('AssetParentHierarchy', equipment)}
          />
        }
      />

      <EAMAutocomplete
        {...processElementInfo(assetLayout.fields.primarysystem)}
        value = {getParentPrimarySystemCode('AssetParentHierarchy', equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        renderDependencies={[equipment.AssetParentHierarchy]}
        onSelect={onChangeSystem}
        endAdornment={
          <Dependency
            onChangeHandler={onChangeSystemDependency}
            value={getDependencyType(equipment.AssetParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getParentPrimarySystemCode('AssetParentHierarchy', equipment)}
          />
        }
      />

      <EAMAutocomplete
        {...processElementInfo(assetLayout.fields.location)}
        {...createAutocompleteHandler(assetLayout.fields.location, assetLayout.fields, equipment, assetLayoutPropertiesMap.location?.autocompleteHandlerData)}
        value={get(equipment, 'AssetParentHierarchy.LocationDependency.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'AssetParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || 
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.NONE &&
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.LOCATION
        }
        onSelect={onChangeLocation}
        renderDependencies={[equipment.AssetParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default AssetHierarchy;

import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import Dependency from "../components/Dependency";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import { getAssetHierarchyCode, getPositionHierarchyCode, getAssetHierarchyObject, ParentDependencyTypes, getDependencyType, getPrimarySystemHierarchyCode } from "./assethierarchytools";


const AssetHierarchy = (props) => {
  const {
    equipment,
    updateEquipmentProperty,
    register,
    readOnly,
    showWarning,
    assetLayout
  } = props;


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
          console.log("select asset")
          let hierarchy = getAssetHierarchyObject({parentAssetCode: value?.code ? value.code : '', 
                                                  parentAssetOrg: value?.org ? value.org : ''}, equipment.AssetParentHierarchy)
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
        renderDependencies={[equipment.AssetParentHierarchy]}

        onSelect={value => {
          let hierarchy = getAssetHierarchyObject({parentPositionCode:  value?.code ? value.code : '', 
                                                  parentPositionOrg: value?.org ? value.org : ''}, equipment.AssetParentHierarchy)
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
      />

      <EAMAutocomplete
        {...processElementInfo(assetLayout.fields.primarysystem)}
        value = {getPrimarySystemHierarchyCode(equipment)}
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        renderDependencies={[equipment.AssetParentHierarchy]}
        
        onSelect={value => {
          let hierarchy = getAssetHierarchyObject({parentPrimarySystemCode:  value?.code ? value.code : '', 
                                                  parentPrimarySystemOrg: value?.org ? value.org : ''}, equipment.AssetParentHierarchy)
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
      />

      <EAMAutocomplete
        {...register( "location")}
        value={get(equipment, 'AssetParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || 
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.NONE &&
          getDependencyType(equipment.AssetParentHierarchy) !== ParentDependencyTypes.LOCATION
        }
        onSelect={value => {
          console.log("on select")
          let hierarchy = getAssetHierarchyObject({parentLocationCode: value.code, parentLocationOrg: value.org, dependencyType: ParentDependencyTypes.LOCATION}, equipment.AssetParentHierarchy)
          updateEquipmentProperty("AssetParentHierarchy", hierarchy)
        }}
        renderDependencies={[equipment.AssetParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default AssetHierarchy;

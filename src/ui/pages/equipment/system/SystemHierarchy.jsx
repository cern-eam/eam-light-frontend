import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from "../components/Dependency";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { getDependencyType, getHierarchyObject, getParentPrimarySystemCode, ParentDependencyTypes } from "../asset/assethierarchytools";
import { get } from "lodash";

const SystemHierarchy = (props) => {
  const {
    equipment,
    updateEquipmentProperty,
    register,
    readOnly,
    showWarning,
    systemLayout
  } = props;

  console.log("kura", get(equipment, 'SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE'), equipment)


  const onChangePrimarySystem = (value) => {
      let hierarchy = {
        SYSTEMID: {
          EQUIPMENTCODE:  value.code,
          ORGANIZATIONID: {ORGANIZATIONCODE: value.org}
        }
    }
      
    updateEquipmentProperty("SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM", hierarchy)
  }

  return (
    <React.Fragment>
      <EAMTextField
        {...register("udfchar13")}
        readonly={true}
      />

      <EAMTextField
        {...register("udfchar11")}
        readonly={true}
      />
      
      <EAMAutocomplete
        {...processElementInfo(systemLayout.fields.primarysystem)}
        value = {
          get(equipment, 'SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
          get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE')
        }
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        renderDependencies={[equipment.SystemParentHierarchy]}
        
        onSelect={onChangePrimarySystem}

        endAdornment={
          <Dependency
            onChangeHandler={(event) => {
              let hierarchy = getHierarchyObject({dependencyType: event.target.checked ? ParentDependencyTypes.PRIMARYSYSTEM : ParentDependencyTypes.NONE}, equipment.AssetParentHierarchy);
              updateEquipmentProperty("SystemParentHierarchy", hierarchy);
            }}
            value={getDependencyType(equipment.SystemParentHierarchy) === ParentDependencyTypes.PRIMARYSYSTEM}
            disabled={!getParentPrimarySystemCode('SystemParentHierarchy', equipment)}
          />
        }
      />


      <EAMAutocomplete
        {...register( "location")}
        value={get(equipment, 'SystemParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || 
          getDependencyType(equipment.SystemParentHierarchy) !== ParentDependencyTypes.NONE &&
          getDependencyType(equipment.SystemParentHierarchy) !== ParentDependencyTypes.LOCATION
        }
        onSelect={value => {
          let hierarchy = getHierarchyObject({parentLocationCode:  value?.code ? value.code : '', 
            parentLocationOrg: value?.org ? value.org : '', 
            dependencyType: value?.code ? ParentDependencyTypes.LOCATION : ParentDependencyTypes.NONE}, 
            equipment.SystemParentHierarchy)
            updateEquipmentProperty("SystemParentHierarchy", hierarchy)
        }}
        renderDependencies={[equipment.SystemParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default SystemHierarchy;

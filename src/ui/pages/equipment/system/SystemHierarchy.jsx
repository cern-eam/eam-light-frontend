import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from "../components/Dependency";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { getDependencyType, getHierarchyObject, ParentDependencyTypes } from "../asset/assethierarchytools";
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


  const onChangePrimarySystem = (value) => {
    if (!value) {
      updateEquipmentProperty("SystemParentHierarchy", {
        ...equipment.SystemParentHierarchy,
        NONDEPENDENTPRIMARYSYSTEM: null,
        DEPENDENTPRIMARYSYSTEM: null
      })
      return
    }

    updateEquipmentProperty("SystemParentHierarchy", {
      ...equipment.SystemParentHierarchy,
      NONDEPENDENTPRIMARYSYSTEM: {
        SYSTEMID: {
          EQUIPMENTCODE:  value.code,
          ORGANIZATIONID: {ORGANIZATIONCODE: value.org}
        }
      }
    })

  }

  const onChangePrimarySystemDependency = (event) => {
    if (event.target.checked) {
      updateEquipmentProperty('SystemParentHierarchy', {
        ...equipment.SystemParentHierarchy,
        DEPENDENTPRIMARYSYSTEM: equipment.SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM,
        NONDEPENDENTPRIMARYSYSTEM: null,
        DEPENDENTLOCATION: null
      })
    } else {
      updateEquipmentProperty('SystemParentHierarchy', {
        ...equipment.SystemParentHierarchy,
        NONDEPENDENTPRIMARYSYSTEM: equipment.SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM,
        DEPENDENTPRIMARYSYSTEM: null
      })
    }

  }

  const onChangeLocation = (value) => {
    if (!value) {
      updateEquipmentProperty("SystemParentHierarchy", {
        ...equipment.SystemParentHierarchy,
        DEPENDENTLOCATION: null
      })
      return
    }

    updateEquipmentProperty("SystemParentHierarchy", {
      ...equipment.SystemParentHierarchy,
      DEPENDENTLOCATION: {
        LOCATIONID: {
          LOCATIONCODE:  value.code,
          ORGANIZATIONID: {ORGANIZATIONCODE: value.org}
        }
      }
    })

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
            onChangeHandler={onChangePrimarySystemDependency}
            value={!!get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID')}
            disabled={!get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID') && 
                      !get(equipment, 'SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID')}
          />
        }
      />


      <EAMAutocomplete
        {...register( "location")}
        value={get(equipment, 'SystemParentHierarchy.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'SystemParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID')
        }
        onSelect={onChangeLocation}
        renderDependencies={[equipment.SystemParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default SystemHierarchy;

import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import * as React from "react";
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from "../components/Dependency";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import { systemLayoutPropertiesMap } from "../EquipmentTools";
import { createAutocompleteHandler } from "../../../../hooks/tools";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const SystemHierarchy = (props) => {
  const {
    equipment,
    updateEquipmentProperty,
    register,
    readOnly,
    showWarning,
    systemLayout
  } = props;


  const onChangePrimarySystem = (value, manualInput) => {
    if (!manualInput) return

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

  const onChangeLocation = (value, manualInput) => {
    if (!manualInput) return
    
    if (!value?.code) {
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
      
      <EAMComboAutocomplete
        {...processElementInfo(systemLayout.fields.primarysystem)}
        value = {
          get(equipment, 'SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE') ??
          get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID.EQUIPMENTCODE')
        }
        barcodeScanner
        autocompleteHandler={WSEquipment.autocompleteAssetParent}
        autocompleteHandlerParams={["S"]}
        renderDependencies={[equipment.SystemParentHierarchy]}
        
        onChange={onChangePrimarySystem}

        endAdornment={
          <Dependency
            onChangeHandler={onChangePrimarySystemDependency}
            value={!!get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID')}
            disabled={!get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID') && 
                      !get(equipment, 'SystemParentHierarchy.NONDEPENDENTPRIMARYSYSTEM.SYSTEMID')}
          />
        }
      />


      <EAMComboAutocomplete
        {...processElementInfo(systemLayout.fields.location)}
        {...createAutocompleteHandler(systemLayout.fields.location, systemLayout.fields, equipment, systemLayoutPropertiesMap.location?.autocompleteHandlerData)}
        value={get(equipment, 'SystemParentHierarchy.DEPENDENTLOCATION.LOCATIONID.LOCATIONCODE') ??
               get(equipment, 'SystemParentHierarchy.LOCATIONID.LOCATIONCODE')}
        disabled={
          readOnly || get(equipment, 'SystemParentHierarchy.DEPENDENTPRIMARYSYSTEM.SYSTEMID')
        }
        onChange={onChangeLocation}
        renderDependencies={[equipment.SystemParentHierarchy]}
      />
    </React.Fragment>
  );
};

export default SystemHierarchy;

import WSEquipment from "@/tools/WSEquipment";
import { GridTypes } from "../../../tools/entities/GridRequest";
import { autocompleteDepartment } from "../../../tools/WSGrids";

class EquipmentTools {
  isRegionAvailable(regionCode, equipmentLayout, equipmentType) {
    //Fields and tabs
    const { fields, tabs } = equipmentLayout;
    //Check according to the case
    switch (regionCode) {
      case "CUSTOM_FIELDS":
        //Block Name depends on the type of equipment
        const blockName =
          equipmentType === "P" || equipmentType === "S"
            ? "block_4"
            : "block_6";
        return fields[blockName] && fields[blockName].attribute !== "H";
      default: /*All other regions*/
        //Regions in here:
        // Parts associated
        return (
          tabs.fields[regionCode] && tabs.fields[regionCode].alwaysAvailable
        );
    }
  }

  getUpdateStatus(updateProperty, showNotification) {
    return (key, value) => {
      if (key === "statusCode" && value === "D") {
        showNotification(
          "Updating the equipment status to Hors service definitif (D) will lead to the its hierarchy being nullified."
        );
      }
      updateProperty(key, value);
    };
  }
}

export default new EquipmentTools();

export const onCategoryChange = (category, updateProperty) => {
  console.log('category', category)
  if (!category) {
    return;
  }

  WSEquipment.getCategory(category)
    .then((response) => {
      const category = response.body.Result.ResultData.EquipmentCategory;

      //TODO
    //   if (category.manufacturerCode) {
    //     updateProperty("manufacturerCode", category.manufacturerCode);
    //     updateProperty("manufacturerDesc", category.manufacturerDesc);
    //   }
     })
    .catch((error) => {
      console.error(error);
    });
};

// Used in hierarchies to handle dependency-related behavior // TODO
export const onChangeDependentInput = (
  value,
  dependencyKey,
  dependencyKeysMap,
  equipment,
  updateEquipmentProperty,
  showWarning
) => {
  // Check whether there are no dependencies set
  const noDependencySet = Object.values(dependencyKeysMap)
    .map((depKey) => equipment[depKey])
    .every((dependency) => dependency === "false");

  // We only set a dependency when we still have no dependent
  if (value && noDependencySet) {
    updateEquipmentProperty(dependencyKey, true.toString());
    // If there is already a dependency (not on the current input) we warn the users:
  } else if (value && equipment[dependencyKey] === "false") {
    showWarning(
      "Changing this value does not change the dependent.\
                    Please press the respective dependency icon \
                    if you would like to set it as dependent."
    );
    // Set as not dependent on input clear
  } else if (!value) {
    updateEquipmentProperty(dependencyKey, false.toString());
  }
};


export function isClosedEquipment(equipment) {
  return equipment.systemStatusCode === "D";
}

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const equipmentLayoutPropertiesMap = {

  equipmentno: {
    noOrgDescProps: true,
    alias: 'code'
  },

  equipmentdesc: {
    alias: "description"
  },

  department: {
    alias: "departmentcode"
  },

  assetstatus: {
    alias: "statuscode"
  },

  manufacturer: {
    alias: "manufacturercode"
  },

  commissiondate: {
    alias: "comissiondate" // backwards compatible because of the typo we had on our end 
  }, 

  category: {
    autocompleteHandlerData: {
        resultMap: {
            code: "category",
            desc: "categorydesc",
            class: "categoryclass",
            manufacturer: "manufacturer"
        }
    },
    alias: 'categorycode'
  },

  class: {
    autocompleteHandlerData: {
        resultMap: {
            code: "class",
            desc: "des_text",
            organization: "classorganization"
        }
    },
    alias: "classcode"
  },

  location: {
    autocompleteHandlerData: {
        resultMap: {
            code: "equipmentcode",
            desc: "description_obj",
            org: "equiporganization"
        },
        gridType: GridTypes.LIST
    }
  }
};

export const assetLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,

  costcode: {
    autocompleteHandlerData: {
        resultMap: {
            code: "costcode",
            desc: "costcodedescription",
            organization: "costcodeorg"
        }
    }
},

  part: {
    link: "/part/",
    clear: 'PartAssociation.STORELOCATION'
  }
};

export const positionLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
};

export const systemLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
};

export const locationLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap
};


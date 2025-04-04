import WSEquipment from "@/tools/WSEquipment";

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
  if (!category) {
    return;
  }

  WSEquipment.getCategory(category)
    .then((response) => {
      const category = response.body.data;

      if (category.classCode) {
        updateProperty("classCode", category.classCode);
        updateProperty("classDesc", category.classDesc); // TODO: this does not appear to be included in the response
      }

      if (category.manufacturerCode) {
        updateProperty("manufacturerCode", category.manufacturerCode);
        updateProperty("manufacturerDesc", category.manufacturerDesc);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// Used in hierarchies to handle dependency-related behavior
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

// Check whether there is at least one dependency set
export const isDependencySet = (equipment, dependencyKeysMap) => {
  return Object.values(dependencyKeysMap)
    .map((depKey) => equipment[depKey])
    .includes("true");
};

export function isClosedEquipment(equipment) {
  return equipment.systemStatusCode === "D";
}

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const equipmentLayoutPropertiesMap = {
  equipmentno: "code",
  alias: "alias",
  assetstatus: "statusCode",
  assignedto: "assignedTo",
  category: "categoryCode",
  class: "classCode",
  commissiondate: "comissionDate",
  criticality: "criticality",
  department: "departmentCode",
  equipmentdesc: "description",
  location: "hierarchyLocationCode",
  manufacturer: "manufacturerCode",
  model: "model",
  primarysystem: "hierarchyPrimarySystemCode",
  serialnumber: "serialNumber",
  udfchar01: "userDefinedFields.udfchar01",
  udfchar02: "userDefinedFields.udfchar02",
  udfchar03: "userDefinedFields.udfchar03",
  udfchar04: "userDefinedFields.udfchar04",
  udfchar05: "userDefinedFields.udfchar05",
  udfchar06: "userDefinedFields.udfchar06",
  udfchar07: "userDefinedFields.udfchar07",
  udfchar08: "userDefinedFields.udfchar08",
  udfchar09: "userDefinedFields.udfchar09",
  udfchar10: "userDefinedFields.udfchar10",
  udfchar11: "userDefinedFields.udfchar11",
  udfchar11: "userDefinedFields.udfchar11",
  udfchar12: "userDefinedFields.udfchar12",
  udfchar13: "userDefinedFields.udfchar13",
  udfchar13: "userDefinedFields.udfchar13",
  udfchar14: "userDefinedFields.udfchar14",
  udfchar15: "userDefinedFields.udfchar15",
  udfchar16: "userDefinedFields.udfchar16",
  udfchar17: "userDefinedFields.udfchar17",
  udfchar18: "userDefinedFields.udfchar18",
  udfchar19: "userDefinedFields.udfchar19",
  udfchar20: "userDefinedFields.udfchar20",
  udfchar21: "userDefinedFields.udfchar21",
  udfchar22: "userDefinedFields.udfchar22",
  udfchar23: "userDefinedFields.udfchar23",
  udfchar24: "userDefinedFields.udfchar24",
  udfchar25: "userDefinedFields.udfchar25",
  udfchar26: "userDefinedFields.udfchar26",
  udfchar27: "userDefinedFields.udfchar27",
  udfchar28: "userDefinedFields.udfchar28",
  udfchar29: "userDefinedFields.udfchar29",
  udfchar30: "userDefinedFields.udfchar30",
  udfchar31: "userDefinedFields.udfchar31",
  udfchar32: "userDefinedFields.udfchar32",
  udfchar33: "userDefinedFields.udfchar33",
  udfchar34: "userDefinedFields.udfchar34",
  udfchar35: "userDefinedFields.udfchar35",
  udfchar36: "userDefinedFields.udfchar36",
  udfchar37: "userDefinedFields.udfchar37",
  udfchar38: "userDefinedFields.udfchar38",
  udfchar39: "userDefinedFields.udfchar39",
  udfchar40: "userDefinedFields.udfchar40",
  udfchar41: "userDefinedFields.udfchar41",
  udfchar42: "userDefinedFields.udfchar42",
  udfchar43: "userDefinedFields.udfchar43",
  udfchar44: "userDefinedFields.udfchar44",
  udfchar45: "userDefinedFields.udfchar45",
  udfchar46: "userDefinedFields.udfchar46",
  udfchar47: "userDefinedFields.udfchar47",
  udfchar48: "userDefinedFields.udfchar48",
  udfchar49: "userDefinedFields.udfchar49",
  udfchar50: "userDefinedFields.udfchar50",
  udfchar51: "userDefinedFields.udfchar51",
  udfchar52: "userDefinedFields.udfchar52",
  udfchar53: "userDefinedFields.udfchar53",
  udfchar54: "userDefinedFields.udfchar54",
  udfchar55: "userDefinedFields.udfchar55",
  udfchkbox01: "userDefinedFields.udfchkbox01",
  udfchkbox02: "userDefinedFields.udfchkbox02",
  udfchkbox03: "userDefinedFields.udfchkbox03",
  udfchkbox04: "userDefinedFields.udfchkbox04",
  udfchkbox05: "userDefinedFields.udfchkbox05",
  udfchkbox06: "userDefinedFields.udfchkbox06",
  udfchkbox07: "userDefinedFields.udfchkbox07",
  udfchkbox08: "userDefinedFields.udfchkbox08",
  udfchkbox09: "userDefinedFields.udfchkbox09",
  udfchkbox10: "userDefinedFields.udfchkbox10",
  udfdate01: "userDefinedFields.udfdate01",
  udfdate02: "userDefinedFields.udfdate02",
  udfdate03: "userDefinedFields.udfdate03",
  udfdate04: "userDefinedFields.udfdate04",
  udfdate05: "userDefinedFields.udfdate05",
  udfdate06: "userDefinedFields.udfdate06",
  udfdate07: "userDefinedFields.udfdate07",
  udfdate08: "userDefinedFields.udfdate08",
  udfdate09: "userDefinedFields.udfdate09",
  udfdate10: "userDefinedFields.udfdate10",
  udfnum01: "userDefinedFields.udfnum01",
  udfnum02: "userDefinedFields.udfnum02",
  udfnum03: "userDefinedFields.udfnum03",
  udfnum04: "userDefinedFields.udfnum04",
  udfnum05: "userDefinedFields.udfnum05",
  udfnum06: "userDefinedFields.udfnum06",
  udfnum07: "userDefinedFields.udfnum07",
  udfnum08: "userDefinedFields.udfnum08",
  udfnum09: "userDefinedFields.udfnum09",
  udfnum10: "userDefinedFields.udfnum10",
};

export const assetLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
  bin: "bin",
  costcode: "costCode",
  parentasset: "hierarchyAssetCode",
  part: "partCode",
  position: "hierarchyPositionCode",
  state: "stateCode",
  store: "storeCode",
};

export const positionLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
  asset: "hierarchyAssetCode",
  parentasset: "hierarchyPositionCode",
};

export const systemLayoutPropertiesMap = {
  ...equipmentLayoutPropertiesMap,
};

export const locationLayoutPropertiesMap = {
  equipmentno: "code",
  equipmentdesc: "description",
  department: "departmentCode",
  class: "classCode",
  costcode: "costCode",
  safety: "safety",
  outofservice: "outOfService",
};

export const COST_ROLL_UP_CODES = {
  asset: "hierarchyAssetCostRollUp",
  position: "hierarchyPositionCostRollUp",
  primarySystem: "hierarchyPrimarySystemCostRollUp",
};

export const updateCostRollUpProperty = (
  costRollUpCode,
  equipmentCode,
  updatingFunction
) => {
  updatingFunction(costRollUpCode, equipmentCode ? true : false);
};

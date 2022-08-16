import WSEquipment from "tools/WSEquipment";

class EquipmentTools {

    isRegionAvailable(regionCode, equipmentLayout, equipmentType) {
        //Fields and tabs
        const {fields, tabs} = equipmentLayout;
        //Check according to the case
        switch (regionCode) {
            case 'CUSTOM_FIELDS':
                //Block Name depends on the type of equipment
                const blockName = equipmentType === 'P' || equipmentType === 'S' ? 'block_4' : 'block_6';
                return fields[blockName] && fields[blockName].attribute !== 'H';
            default:/*All other regions*/
                //Regions in here:
                // Parts associated
                return tabs.fields[regionCode] && tabs.fields[regionCode].alwaysAvailable;
        }
    }

    getUpdateStatus(updateProperty, showNotification) {
        return (key, value) => {
            if (key === 'statusCode' && value === 'D') {
                showNotification("Updating the equipment status to Hors service definitif (D) will lead to the its hierarchy being nullified.");
            }
            updateProperty(key, value);
        }
    }
}

export default new EquipmentTools();


export const onCategoryChange = (category, updateProperty) => {

    if(!category) {
        return;
    }

    WSEquipment.getCategoryData(category).then(response => {
        const categoryData = response.body.data[0];

            if(categoryData.categoryclass) {
                updateProperty('classCode', categoryData.categoryclass);
                updateProperty('classDesc', categoryData.categoryclassdesc); // TODO: this does not appear to be included in the response
            }

            if(categoryData.manufacturer) {
                updateProperty('manufacturerCode', categoryData.manufacturer);
            }

        })
    .catch(error => {
        console.log(error);
    });
    
}

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
        .every((dependency) => dependency === 'false');

    // We only set a dependency when we still have no dependent
    if (value && noDependencySet) {
        updateEquipmentProperty(dependencyKey, true.toString());
    // If there is already a dependency (not on the current input) we warn the users:
    } else if (value && equipment[dependencyKey] === 'false') {
        showWarning('Changing this value does not change the dependent.\
                    Please press the respective dependency icon \
                    if you would like to set it as dependent.');
    // Set as not dependent on input clear
    } else if (!value) {
        updateEquipmentProperty(dependencyKey, false.toString());
    }
};

// Check whether there is at least one dependency set
export const isDependencySet = (equipment, dependencyKeysMap) => {
    return Object.values(dependencyKeysMap)
        .map((depKey) => equipment[depKey])
        .includes('true');
}


export function isClosedEquipment(equipment) {
    return equipment.systemStatusCode === 'D';
}

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
const equipmentLayoutPropertiesMap =  {
    alias: "alias",
    equipmentdesc: "description",
    department: "departmentCode",
    assetstatus: "statusCode",
    class: "classCode",
    category: "categoryCode",
    commissiondate: "comissionDate",
    assignedto: "assignedTo",
    criticality: "criticality",
    manufacturer: "manufacturerCode",
    serialnumber: "serialNumber",
    model: "model",
    udfchar13: "userDefinedFields.udfchar13",
    udfchar11: "userDefinedFields.udfchar11",
    primarysystem: "hierarchyPrimarySystemCode",
    location: "hierarchyLocationCode",
    udfchar45: "userDefinedFields.udfchar45",
    udfchar46: "userDefinedFields.udfchar46",
    udfchar43: "userDefinedFields.udfchar43",
    udfchar44: "userDefinedFields.udfchar44",
    udfchar41: "userDefinedFields.udfchar41",
    udfchar42: "userDefinedFields.udfchar42",
    udfchar40: "userDefinedFields.udfchar40",
    udfchar49: "userDefinedFields.udfchar49",
    udfchar47: "userDefinedFields.udfchar47",
    udfchar48: "userDefinedFields.udfchar48",
    udfchar54: "userDefinedFields.udfchar54",
    udfchar55: "userDefinedFields.udfchar55",
    udfchar52: "userDefinedFields.udfchar52",
    udfchar53: "userDefinedFields.udfchar53",
    udfchar50: "userDefinedFields.udfchar50",
    udfchar51: "userDefinedFields.udfchar51",
    udfchar23: "userDefinedFields.udfchar23",
    udfchar24: "userDefinedFields.udfchar24",
    udfchar21: "userDefinedFields.udfchar21",
    udfchar22: "userDefinedFields.udfchar22",
    udfchar20: "userDefinedFields.udfchar20",
    udfchar29: "userDefinedFields.udfchar29",
    udfchar27: "userDefinedFields.udfchar27",
    udfchar28: "userDefinedFields.udfchar28",
    udfchar25: "userDefinedFields.udfchar25",
    udfchar26: "userDefinedFields.udfchar26",
    udfchar34: "userDefinedFields.udfchar34",
    udfchar35: "userDefinedFields.udfchar35",
    udfchar32: "userDefinedFields.udfchar32",
    udfchar33: "userDefinedFields.udfchar33",
    udfchar30: "userDefinedFields.udfchar30",
    udfchar31: "userDefinedFields.udfchar31",
    udfchar38: "userDefinedFields.udfchar38",
    udfchar39: "userDefinedFields.udfchar39",
    udfchar36: "userDefinedFields.udfchar36",
    udfchar37: "userDefinedFields.udfchar37",
    udfchar01: "userDefinedFields.udfchar01",
    udfchar02: "userDefinedFields.udfchar02",
    udfchar09: "userDefinedFields.udfchar09",
    udfchar07: "userDefinedFields.udfchar07",
    udfchar08: "userDefinedFields.udfchar08",
    udfchar05: "userDefinedFields.udfchar05",
    udfchar06: "userDefinedFields.udfchar06",
    udfchar03: "userDefinedFields.udfchar03",
    udfchar04: "userDefinedFields.udfchar04",
    udfchar12: "userDefinedFields.udfchar12",
    udfchar13: "userDefinedFields.udfchar13",
    udfchar10: "userDefinedFields.udfchar10",
    udfchar11: "userDefinedFields.udfchar11",
    udfchar18: "userDefinedFields.udfchar18",
    udfchar19: "userDefinedFields.udfchar19",
    udfchar16: "userDefinedFields.udfchar16",
    udfchar17: "userDefinedFields.udfchar17",
    udfchar14: "userDefinedFields.udfchar14",
    udfchar15: "userDefinedFields.udfchar15",
    udfnum09: "userDefinedFields.udfnum09",
    udfnum04: "userDefinedFields.udfnum04",
    udfnum03: "userDefinedFields.udfnum03",
    udfnum02: "userDefinedFields.udfnum02",
    udfnum01: "userDefinedFields.udfnum01",
    udfnum08: "userDefinedFields.udfnum08",
    udfnum07: "userDefinedFields.udfnum07",
    udfnum06: "userDefinedFields.udfnum06",
    udfnum05: "userDefinedFields.udfnum05",
    udfnum10: "userDefinedFields.udfnum10",
    udfdate04: "userDefinedFields.udfdate04",
    udfdate03: "userDefinedFields.udfdate03",
    udfdate06: "userDefinedFields.udfdate06",
    udfdate05: "userDefinedFields.udfdate05",
    udfdate08: "userDefinedFields.udfdate08",
    udfdate07: "userDefinedFields.udfdate07",
    udfdate09: "userDefinedFields.udfdate09",
    udfdate02: "userDefinedFields.udfdate02",
    udfdate01: "userDefinedFields.udfdate01",
    udfdate10: "userDefinedFields.udfdate10",
    udfchkbox02: "userDefinedFields.udfchkbox02",
    udfchkbox03: "userDefinedFields.udfchkbox03",
    udfchkbox01: "userDefinedFields.udfchkbox01",
    udfchkbox08: "userDefinedFields.udfchkbox08",
    udfchkbox09: "userDefinedFields.udfchkbox09",
    udfchkbox06: "userDefinedFields.udfchkbox06",
    udfchkbox07: "userDefinedFields.udfchkbox07",
    udfchkbox04: "userDefinedFields.udfchkbox04",
    udfchkbox05: "userDefinedFields.udfchkbox05",
    udfchkbox10: "userDefinedFields.udfchkbox10",
}

export const assetLayoutPropertiesMap =  {
    ...equipmentLayoutPropertiesMap,
    state: "stateCode",
    costcode: "costCode",
    part: "partCode",
    store: "storeCode",
    bin: "bin",
    parentasset: "hierarchyAssetCode",
    position: "hierarchyPositionCode",
}

export const positionLayoutPropertiesMap =  {
    ...equipmentLayoutPropertiesMap,
    asset: "hierarchyAssetCode",
    parentasset: "hierarchyPositionCode",
}

export const systemLayoutPropertiesMap =  {
    ...equipmentLayoutPropertiesMap,
}

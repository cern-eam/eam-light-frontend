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

    assetLayoutPropertiesMap = {
        state: "stateCode"
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

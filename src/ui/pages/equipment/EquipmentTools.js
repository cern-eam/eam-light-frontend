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
                updateProperty('classDesc', categoryData.categoryclassdesc);
            }

            if(categoryData.manufacturer) {
                updateProperty('manufacturerCode', categoryData.manufacturer);
            }

        })
    .catch(error => {
        console.log(error);
    });
    
}
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
                return tabs[regionCode] && tabs[regionCode].alwaysAvailable;
        }
    }

    assetLayoutPropertiesMap = {
        state: "stateCode"
    }
}

export default new EquipmentTools();
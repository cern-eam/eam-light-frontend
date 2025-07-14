// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMap =  {

    uom: {
        autocompleteHandlerData: { 
            resultMap: {
                code: "uomcode",
                desc: "description"
            }
        }
    }
}

class PartTools {


    isRegionAvailable(regionCode, partLayout) {
        //Fields and tabs
        const {fields, tabs} = partLayout;
        //Check according to the case
        switch (regionCode) {
            case 'CUSTOM_FIELDS':
                //Is the block 6
                return fields.block_6 && fields.block_6.attribute !== 'H';
            default:/*All other regions*/
                //Regions in here:
                // Where used
                return tabs.fields[regionCode] && tabs.fields[regionCode].alwaysAvailable;
        }
    }

}

export default new PartTools();
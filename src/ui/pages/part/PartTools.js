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
                return tabs[regionCode] && tabs[regionCode].alwaysAvailable;
        }
    }

    layoutPropertiesMap = {
        commoditycode: "commodityCode"
    }
}

export default new PartTools();
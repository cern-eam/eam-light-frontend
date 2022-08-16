// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMap =  {
    description: "description",
    class: "classCode",
    category: "categoryCode",
    uom: "uom",
    trackingtype: "trackingMethod",
    commoditycode: "commodityCode",
    trackbyasset: "trackByAsset",
    repairablespare: "trackCores",
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
    udfchar30: "userDefinedFields.udfchar30",
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
    udfnum04: "userDefinedFields.udfnum04",
    udfnum03: "userDefinedFields.udfnum03",
    udfnum02: "userDefinedFields.udfnum02",
    udfnum01: "userDefinedFields.udfnum01",
    udfnum05: "userDefinedFields.udfnum05",
    udfdate04: "userDefinedFields.udfdate04",
    udfdate03: "userDefinedFields.udfdate03",
    udfdate05: "userDefinedFields.udfdate05",
    udfdate02: "userDefinedFields.udfdate02",
    udfdate01: "userDefinedFields.udfdate01",
    udfchkbox02: "userDefinedFields.udfchkbox02",
    udfchkbox03: "userDefinedFields.udfchkbox03",
    udfchkbox01: "userDefinedFields.udfchkbox01",
    udfchkbox04: "userDefinedFields.udfchkbox04",
    udfchkbox05: "userDefinedFields.udfchkbox05",
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
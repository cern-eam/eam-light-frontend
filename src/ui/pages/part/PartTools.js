// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMap =  {
    category: "categoryCode",
    class: "classCode",
    commoditycode: "commodityCode",
    description: "description",
    repairablespare: "trackCores",
    trackbyasset: "trackByAsset",
    trackingtype: "trackingMethod",
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
    udfchar12: "userDefinedFields.udfchar12",
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
    udfchkbox01: "userDefinedFields.udfchkbox01",
    udfchkbox02: "userDefinedFields.udfchkbox02",
    udfchkbox03: "userDefinedFields.udfchkbox03",
    udfchkbox04: "userDefinedFields.udfchkbox04",
    udfchkbox05: "userDefinedFields.udfchkbox05",
    udfdate01: "userDefinedFields.udfdate01",
    udfdate02: "userDefinedFields.udfdate02",
    udfdate03: "userDefinedFields.udfdate03",
    udfdate04: "userDefinedFields.udfdate04",
    udfdate05: "userDefinedFields.udfdate05",
    udfnum01: "userDefinedFields.udfnum01",
    udfnum02: "userDefinedFields.udfnum02",
    udfnum03: "userDefinedFields.udfnum03",
    udfnum04: "userDefinedFields.udfnum04",
    udfnum05: "userDefinedFields.udfnum05",
    uom: "uom",
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
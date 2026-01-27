import { getPartTrackingMethods } from "../../../tools/WSParts";

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMap =  {

    partcode: {
        noOrgDescProps: true,
        extraProps: (ctx) => ({
            hidden: !ctx.newEntity
        })
    },

    uom: {
        autocompleteHandlerData: { 
            resultMap: {
                code: "uomcode",
                desc: "description"
            }
        }
    },

    trackingtype: {
        autocompleteHandlerData: { 
            handler: getPartTrackingMethods
        }
    }
}

export const PART_BLOCKS = {
  GENERAL: "block_1",
  TRACKINGSECTION: "block_2",
  PARTSUMMARYSECTION: "block_3",
  PROFILEATTACHMENTSECTION: "block_4",
  ORDERDETAILSSECTION: "block_5",
  CUSTOMFIELDSSECTION: "block_6",
  BLOCK_7: "block_7",
  USERDEFINEDFIELDSSECTION: "block_8",
  CONDITIONDETAILSSECTION: "block_9"
};

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
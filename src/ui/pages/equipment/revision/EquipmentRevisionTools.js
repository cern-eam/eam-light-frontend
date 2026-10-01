import { readUserCodes } from "../../../../tools/WSGrids";

export const equipmentRevisionLayoutPropertiesMap = {
  equipmentrevisionstatus: {
    extraProps: {
      autocompleteHandler: readUserCodes,
      autocompleteHandlerParams: ["RTST"],
    },
  },
  revision: {
    extraProps: {
      noOrgDesc: true,
    },
  },
};

export const REVISION_BLOCKS = {
  GENERAL: {
    code: "block_1",
    containers: ['cont_1', 'cont_2', 'cont_3', 'cont_4']
  },


  DETAILS: {
    code: "block_3",
    containers: ['cont_7']
  },
  CUSTOMFIELDSSECTION: {
    code: "block_15",
    containers: ['cont_5', 'cont_6', 'cont_7', 'cont_8']
  },
  USERDEFINEDFIELDSSECTION: {
    code: "block_9",
    containers: ['cont_19', 'cont_20']
  }

};
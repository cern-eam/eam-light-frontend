import { readUserCodes } from "../../../../tools/WSGrids";

export const equipmentRevisionLayoutPropertiesMap = {
  equipmentrevisionstatus: {
    extraProps: {
      autocompleteHandler: readUserCodes,
      autocompleteHandlerParams: ["RTST"],
    },
  },
};

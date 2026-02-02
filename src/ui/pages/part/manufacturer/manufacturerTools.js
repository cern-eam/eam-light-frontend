import { isMultiOrg } from "../../EntityTools";

export const layoutPropertiesMap = {
  organization: {
    extraProps: {
      hidden: !isMultiOrg,
    },
  },

  manufacturer: {
    noOrgDescProps: true,
  }
};

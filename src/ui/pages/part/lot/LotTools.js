import { isMultiOrg } from "../../EntityTools";

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMap = {
    lotcode: {
        noOrgDescProps: true,
        extraProps: (ctx) => ({
            hidden: !ctx.newEntity
        })
    },

    lotorganization: {
        extraProps: {
            hidden: !isMultiOrg
        }
    }
};

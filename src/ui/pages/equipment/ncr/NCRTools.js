export const layoutPropertiesMap = {
    description: "description",
    equipment: "equipmentCode",
    organization: "organizationCode"
};

export function isRegionAvailable(regionCode, ncrLayout) {
    //Fields and tabs
    const { fields } = ncrLayout;
    //Check according to the case
    switch (regionCode) {
        case "CUSTOM_FIELDS_EQP":
            //Is button viewequipcustomfields
            return (
                fields.viewequipcustomfields &&
                fields.viewequipcustomfields.attribute === "O"
            );
        case "CUSTOM_FIELDS_PART":
            //Is button viewequipcustomfields
            return (
                fields.viewequipcustomfields &&
                fields.viewequipcustomfields.attribute === "O"
            );
        default:
            return true;
    }
}

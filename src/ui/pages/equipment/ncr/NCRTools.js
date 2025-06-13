export const layoutPropertiesMap = {
    description: "description",
    organization: "organizationCode",
    equipment: {
        value: "EQUIPMENTID.EQUIPMENTCODE",
        desc: "EQUIPMENTID.DESCRIPTION",
        org: 'EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE',
        alias: "equipmentCode"
    },
    location: {
        org: 'LOCATIONID.ORGANIZATIONCODE',
        alias: "locationCode"
    },
    class: {
        value: "CLASSID.CLASSCODE",
        desc: "CLASSID.DESCRIPTION",
        org: "CLASSID.ORGANIZATIONID.ORGANIZATIONCODE",
        alias: "classCode"
    },
    department: {
        value: "DEPARTMENTID.DEPARTMENTCODE",
        desc: "DEPARTMENTID.DESCRIPTION",
        alias: "departmentCode"
    },
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

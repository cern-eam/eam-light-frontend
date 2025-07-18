import { GridTypes } from "../../../../tools/entities/GridRequest";

export const layoutPropertiesMap = {
    description: "description",
    organization: "organizationCode",
    equipment: {
        value: "EQUIPMENTID.EQUIPMENTCODE",
        desc: "EQUIPMENTID.DESCRIPTION",
        org: 'EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE',
        alias: "equipmentCode",
        autocompleteHandlerData: {
            resultMap: {
                code: "equipmentcode",
                desc: "description_obj",
                organization: "equiporganization",
                equipmentType: "equipmentrtype"
            },
            gridType: GridTypes.LIST
        }
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
    type: {
        org: "NONCONFORMITYTYPEID.ORGANIZATIONID.ORGANIZATIONCODE",
        alias: "typeCode"
    }
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

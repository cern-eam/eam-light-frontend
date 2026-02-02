import { GridTypes } from "../../../../tools/entities/GridRequest";
import WS from "../../../../tools/WS";
import { readStatuses } from "../../../../tools/WSGrids";
import { isMultiOrg } from "../../EntityTools";

export const layoutPropertiesMap = {

    equipment: {
        alias: "equipmentCode",
        link: "/equipment/",
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
        alias: "classCode"
    },

    department: {
        alias: "departmentCode"
    },

    type: {
        alias: "typeCode"
    },

    severity: {
        extraProps: {
            autocompleteHandler: WS.getCodeLov,
            autocompleteHandlerParams: ["SEVE"]
        }
    },

    importance: {
        extraProps: {
            autocompleteHandler: WS.getCodeLov, 
            autocompleteHandlerParams: ["IMPT"]
        }
    },

    status: {
        extraProps: (ctx) => ({
            autocompleteHandler: readStatuses,
            autocompleteHandlerParams: ["NOCF", ctx.newEntity, ctx.ncr.statusCode],
            renderDependencies: [ctx.newEntity, ctx.ncr.statusCode]
        })
    },

    nonconformity: {
        extraProps: {
            hidden: true
        }
    },

    organization: {
        extraProps: {
            hidden: !isMultiOrg
        }
    },

    note: {
        extraProps: {
            textarea: true
        }
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

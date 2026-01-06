import { GridTypes } from "../../../tools/entities/GridRequest";
import { autocompleteDepartment } from "../../../tools/WSGrids";
import WSWorkorders from "../../../tools/WSWorkorders";

export const bookLabourPropertiesMap = {

    employee: {
        autocompleteHandlerData: {
            gridType: GridTypes.LIST
        },
    },
}

export const layoutPropertiesMap = {

    workorderstatus: {
        alias: "statuscode"
    },

    equipment: {
        autocompleteHandlerData: {
            resultMap: {
                code: "equipmentcode",
                desc: "description_obj",
                organization: "equiporganization",
                equipmentType: "equipmentrtype"
            },
            searchKeys: ["equipmentcode"],
            gridType: GridTypes.LIST
        },
        link: "/equipment/",
        alias: "equipmentCode"
        //onChange: (v1, v2) => console.log(v1, v2)
    },

    location: {
        autocompleteHandlerData: {
            resultMap: {
                code: "equipmentcode",
                desc: "equipmentdesc",
                organization: "equiporganization"
            },
            searchKeys: ["equipmentcode"],
            gridType: GridTypes.LIST
        },
        alias: "locationCode",
        clear: "LOCATIONID",
    },

    department: {
        alias: "departmentCode",
        autocompleteHandlerData: {
            handler: autocompleteDepartment
        }
    },

    woclass: {
        alias: "classCode"
    },

    standardwo: {
        autocompleteHandlerData: {
            searchKeys: ["standardwo"],
            resultMap: {code: "standardwo", desc: "standardwodesc", organization: "standardwoorg"}
        },
        alias: "standardWO"
    },

    udfchar01: {
        link: 'https://cern.service-now.com/task.do?sysparm_query=number='
    },

    udfchar24: {
        link: 'https://its.cern.ch/jira/browse/'
    },

    priority: {
        autocompleteHandlerData: {
            handler: WSWorkorders.getWorkOrderPriorities
        }
    },

}

export const ncrWorkOrderPropertiesMap = {
    assignedto: {
        autocompleteHandlerData: {
            searchKeys: ['personcode', 'description'],
            resultMap: {code: "personcode", desc: "description"}
        }
    },

    equipment: layoutPropertiesMap.equipment
}

export function isReadOnlyCustomHandler(workOrder) {
    return false
    //TODO return workOrder.systemStatusCode === 'C' || !workOrder.jtAuthCanUpdate;
}

export function isRegionAvailable(regionCode, workOrderLayout) {
    //Fields and tabs
    const {fields} = workOrderLayout;
    //Check according to the case
    switch (regionCode) {
        case 'CUSTOM_FIELDS_EQP':
            //Is button viewequipcustomfields
            return fields.viewequipcustomfields && fields.viewequipcustomfields.attribute === 'O';
        case 'CUSTOM_FIELDS_PART':
            //Is button viewequipcustomfields
            return fields.viewequipcustomfields && fields.viewequipcustomfields.attribute === 'O';
        default:
            return true;
    }
}

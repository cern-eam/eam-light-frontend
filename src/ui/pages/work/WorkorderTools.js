import { Description } from "@mui/icons-material";
import { GridTypes } from "../../../tools/entities/GridRequest";



export const bookLabourPropertiesMap = {
    octype: {
        autocompleteHandlerData: {
            resultMap: {
                code: "octype",
                desc: "octypedesc"
            }
        }
    },

    employee: {
        autocompleteHandlerData: {
            gridType: GridTypes.LIST,
            searchKeys: ["personcode", "description"]
        },
    },
}

export const activityPropertiesMap = {
    matlcode: {
        autocompleteHandlerData: {
            resultMap: {
                code: "matlist",
                desc: "matlistdesc",
                organization: "matlistorg"
            }
        }
    },

    trade: {
        autocompleteHandlerData: {
            resultMap: {
                code: "trade",
                desc: "tradedesc",
                organization: "tradeorganization"
            }
        }
    }
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
        alias: "departmentCode"
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

    assignedto: {
        autocompleteHandlerData: {
            searchKeys: ['personcode', 'description']
        }
    },

    reportedby: {
        autocompleteHandlerData: {
            searchKeys: ['personcode', 'description']
        }
    },

    udfchar01: {
        link: 'https://cern.service-now.com/task.do?sysparm_query=number='
    },

    udfchar24: {
        link: 'https://its.cern.ch/jira/browse/'
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

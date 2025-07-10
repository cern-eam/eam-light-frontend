import { GridTypes } from "../../../tools/entities/GridRequest";


export const layoutPropertiesMap = {

    workorderstatus: {
        alias: "statuscode"
    },

    equipment: {
        desc: "EQUIPMENTID.DESCRIPTION",
        org: "EQUIPMENTID.ORGANIZATIONID.ORGANIZATIONCODE",
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
        desc: "LOCATIONID.DESCRIPTION",
        org: "LOCATIONID.ORGANIZATIONID.ORGANIZATIONCODE",
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
        desc: "DEPARTMENTID.DESCRIPTION",
        org: "DEPARTMENTID.ORGANIZATIONID.ORGANIZATIONCODE",
        alias: "departmentCode"
    },

    woclass: {
        value: "CLASSID.CLASSCODE",
        desc: "CLASSID.DESCRIPTION",
        org: "CLASSID.ORGANIZATIONID.ORGANIZATIONCODE",
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

    createdby: {
        desc: "CREATEDBY.DESCRIPTION"
    },

    problemcode: {
        desc: "PROBLEMCODEID.DESCRIPTION"
    },

    failurecode: {
        desc: "FAILURECODEID.DESCRIPTION"
    },

    causecode: {
        desc: "CAUSECODEID.DESCRIPTION"
    },

    actioncode: {
        desc: "ACTIONCODEID.DESCRIPTION"
    }

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


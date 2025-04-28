import { GridTypes } from "../../../tools/entities/GridRequest";
import { assignCustomFieldFromCustomField, AssignmentType, assignUserDefinedFields, assignValues } from "../EntityTools";
import { get } from "lodash";

// MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
export const layoutPropertiesMapOld =  {
        description: "description",
        equipment: "equipmentCode",
        location: "locationCode",
        workorderstatus: "statusCode",
        workordertype: "typeCode",
        woclass: "classCode",
        department: "departmentCode",
        parentwo: "parentWO",
        priority: "priorityCode",
        downtimehours: "downtimeHours",
        reportedby: "reportedBy",
        assignedto: "assignedTo",
        reqstartdate: "requestedStartDate",
        reqenddate: "requestedEndDate",
        schedstartdate: "scheduledStartDate",
        schedenddate: "scheduledEndDate",
        startdate: "startDate",
        datecompleted: "completedDate",
        problemcode: "problemCode",
        failurecode: "failureCode",
        causecode: "causeCode",
        actioncode: "actionCode",
        costcode: "costCode",

    }

export const layoutPropertiesMap = {

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
        link: "/equipment"
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
        }
    },

    department: {
        desc: "DEPARTMENTID.DESCRIPTION",
        org: "DEPARTMENTID.ORGANIZATIONID.ORGANIZATIONCODE"
    },

    woclass: {
        value: "CLASSID.CLASSCODE",
        desc: "CLASSID.DESCRIPTION",
        org: "CLASSID.ORGANIZATIONID.ORGANIZATIONCODE"
    },

    standardwo: {
        autocompleteHandlerData: { 
            searchKeys: ["standardwo"],
            resultMap: {code: "standardwo", desc: "standardwodesc", organization: "standardwoorg"}
        }
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


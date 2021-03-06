class WorkorderTools {

    //
    // MAPPING BETWEEN ENTITY KEYS AND LAYOUT ID
    //
     layoutPropertiesMap =  {
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
            udfchar01:	"userDefinedFields.udfchar01",
            udfchar02:	"userDefinedFields.udfchar02",
            udfchar03:	"userDefinedFields.udfchar03",
            udfchar04:	"userDefinedFields.udfchar04",
            udfchar05:	"userDefinedFields.udfchar05",
            udfchar06:	"userDefinedFields.udfchar06",
            udfchar07:	"userDefinedFields.udfchar07",
            udfchar08:	"userDefinedFields.udfchar08",
            udfchar09:	"userDefinedFields.udfchar09",
            udfchar10:	"userDefinedFields.udfchar10",
            udfchar11:	"userDefinedFields.udfchar11",
            udfchar12:	"userDefinedFields.udfchar12",
            udfchar13:	"userDefinedFields.udfchar13",
            udfchar14:	"userDefinedFields.udfchar14",
            udfchar15:	"userDefinedFields.udfchar15",
            udfchar16:	"userDefinedFields.udfchar16",
            udfchar17:	"userDefinedFields.udfchar17",
            udfchar18:	"userDefinedFields.udfchar18",
            udfchar19:	"userDefinedFields.udfchar19",
            udfchar20:	"userDefinedFields.udfchar20",
            udfchar21:	"userDefinedFields.udfchar21",
            udfchar22:	"userDefinedFields.udfchar22",
            udfchar23:	"userDefinedFields.udfchar23",
            udfchar24:	"userDefinedFields.udfchar24",
            udfchar25:	"userDefinedFields.udfchar25",
            udfchar26:	"userDefinedFields.udfchar26",
            udfchar27:	"userDefinedFields.udfchar27",
            udfchar28:	"userDefinedFields.udfchar28",
            udfchar29:	"userDefinedFields.udfchar29",
            udfchar30:	"userDefinedFields.udfchar30",
            udfchar40:	"userDefinedFields.udfchar40",
        }


    isClosedWorkOrder(status) {
        let closedstatuses = ["RP", "C", "TF", "RV", "CANC", "TO", "TT", "TX", "TP", "T", "REJ"];
        return closedstatuses.indexOf(status) > 0;
    }

    isRegionAvailable(regionCode, workOrderLayout) {
        //Fields and tabs
        const {fields} = workOrderLayout;
        //Check according to the case
        switch (regionCode) {
            case 'CUSTOM_FIELDS_EQP':
                //Is button viewequipcustomfields
                return fields.viewequipcustomfields && fields.viewequipcustomfields.attribute === 'O';
            default:
                return true;
        }
    }
}

export default new WorkorderTools();
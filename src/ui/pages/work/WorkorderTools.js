class WorkorderTools {

    isClosedWorkOrder(status) {
        let closedstatuses = ["RP", "C", "TF", "RV", "CANC", "TO", "TT", "TX", "TP", "T", "REJ"];
        return closedstatuses.indexOf(status) > 0;
    }

    isRegionAvailable(regionCode, workOrderLayout) {
        //Fields and tabs
        const {fields, tabs} = workOrderLayout;
        //Check according to the case
        switch (regionCode) {
            case 'CUSTOM_FIELDS':
                //Is block_5
                return fields.block_5 && fields.block_5.attribute !== 'H';
            case 'CUSTOM_FIELDS_EQP':
                //Is button viewequipcustomfields
                return fields.viewequipcustomfields && fields.viewequipcustomfields.attribute === 'O';
            case 'SCHEDULING':
                //All fields for the region must be visible
                return !("H" === fields.reqstartdate.attribute
                    && "H" === fields.reqenddate.attribute
                    && "H" === fields.schedstartdate.attribute
                    && "H" === fields.schedenddate.attribute
                    && "H" === fields.datecompleted.attribute
                    && "H" === fields.startdate.attribute
                    && "H" === fields.reportedby.attribute
                    && "H" === fields.assignedto.attribute
                    && "H" === fields.udfchar17.attribute);
            case 'CLOSING_CODES':
                //All fields visible
                return !("H" === fields.problemcode.attribute
                    && "H" === fields.failurecode.attribute
                    && "H" === fields.causecode.attribute
                    && "H" === fields.actioncode.attribute
                    && "H" === fields.costcode.attribute);
            case 'ACT_BOO':
                //Check the two tabs
                return tabs['ACT'] && tabs['ACT'].alwaysAvailable && tabs['BOO'] && tabs['BOO'].alwaysAvailable;
            default:/*All other regions*/
                //Regions in here:
                // Part Usage, MultiEquipment, Checklists, Children WO, Equipment Custom Fields
                //Check the tab
                return tabs[regionCode] && tabs[regionCode].alwaysAvailable;
        }
    }
}

export default new WorkorderTools();
class WorkorderTools {

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
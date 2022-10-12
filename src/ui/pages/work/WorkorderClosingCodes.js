import React, {Component} from 'react';
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';

const WorkorderClosingCodes = props => {

    let {workOrderLayout, workorder, equipment, register} = props;
    
    if ("H" === workOrderLayout.fields.problemcode.attribute
        && "H" === workOrderLayout.fields.failurecode.attribute
        && "H" === workOrderLayout.fields.causecode.attribute
        && "H" === workOrderLayout.fields.actioncode.attribute
        && "H" === workOrderLayout.fields.costcode.attribute) {
        return null;
    }

    return (
        <React.Fragment>
            <EAMSelect 
                {...register('problemcode', 'problemCode')}
                autocompleteHandler={WSWorkorders.getWorkOrderProblemCodeValues}
                autocompleteHandlerParams={[workorder.classCode, equipment?.classCode, workorder.equipmentCode]}/>

            <EAMSelect 
                {...register('failurecode', 'failureCode')}
                autocompleteHandler={WSWorkorders.getWorkOrderFailureCodeValues}
                autocompleteHandlerParams={[equipment?.classCode, workorder.problemCode, workorder.equipmentCode]}/>

            <EAMSelect 
                {...register('causecode', 'causeCode')}
                autocompleteHandler={WSWorkorders.getWorkOrderCauseCodeValues}
                autocompleteHandlerParams={[equipment?.classCode, workorder.failureCode, workorder.problemCode, workorder.equipmentCode]}/>

            <EAMSelect 
                {...register('actioncode', 'actionCode')}
                autocompleteHandler={WSWorkorders.getWorkOrderActionCodeValues}
                autocompleteHandlerParams={[equipment?.classCode,  workorder.failureCode, workorder.problemCode, workorder.causeCode, workorder.equipmentCode]}/>

            <EAMAutocomplete 
                {...register('costcode', 'costCode', 'costCodeDesc')}
                autocompleteHandler={WSWorkorders.autocompleteCostCode}/>

        </React.Fragment>
    )
    
}

export default WorkorderClosingCodes;
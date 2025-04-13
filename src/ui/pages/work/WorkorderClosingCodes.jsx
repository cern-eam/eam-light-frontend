import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';

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
            <EAMSelect {...register('problemcode')} />

            <EAMSelect {...register('failurecode')} />

            <EAMSelect {...register('causecode')} />

            <EAMSelect {...register('actioncode')} />

        </React.Fragment>
    )
    
}

export default WorkorderClosingCodes;
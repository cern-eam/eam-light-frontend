import React from 'react';
import EAMInput from '../../components/EAMInput';

const WorkorderClosingCodes = props => {

    let {workOrderLayout, register} = props;
    
    if ("H" === workOrderLayout.fields.problemcode.attribute
        && "H" === workOrderLayout.fields.failurecode.attribute
        && "H" === workOrderLayout.fields.causecode.attribute
        && "H" === workOrderLayout.fields.actioncode.attribute
        && "H" === workOrderLayout.fields.costcode.attribute) {
        return null;
    }

    return (
        <React.Fragment>
            <EAMInput {...register('problemcode')} />

            <EAMInput {...register('failurecode')} />

            <EAMInput {...register('causecode')} />

            <EAMInput {...register('actioncode')} />

        </React.Fragment>
    )
    
}

export default WorkorderClosingCodes;
import React from 'react';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

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
            <EAMComboAutocomplete {...register('problemcode')} selectMode={true}/>

            <EAMComboAutocomplete {...register('failurecode')} selectMode={true} />

            <EAMComboAutocomplete {...register('causecode')} selectMode={true} />

            <EAMComboAutocomplete {...register('actioncode')} selectMode={true} />

        </React.Fragment>
    )
    
}

export default WorkorderClosingCodes;
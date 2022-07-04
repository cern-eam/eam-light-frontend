import React from 'react';
import EAMInput from 'eam-components/ui/components/muiinputs/EAMInput'
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';

function CustomFieldCODE(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            children={children}
            elementInfo={elementInfo}
            value={customField.value}
            valueKey="value"
            desc={customField.valueDesc}
            descKey="valueDesc"
            options={lookupValues && lookupValues[customField.code]}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMInput
                children={children}
                elementInfo={elementInfo}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"/>
        )
    }

}

export default CustomFieldCODE;
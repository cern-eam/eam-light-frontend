import React from 'react';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import tools from '../CustomFieldTools'

function CustomFieldNUM(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues, UoM} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};
    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            children={children}
            elementInfo={elementInfo}
            valueKey="value"
            values={lookupValues && lookupValues[customField.code]}
            value={customField.value}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMInput
                children={children}
                elementInfo={elementInfo}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"
                endAdornment={UoM}/>
        )
    }

}

export default CustomFieldNUM;
import React from 'react';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect'
import EAMDateTimePicker from 'eam-components/ui/components/inputs-ng/EAMDateTimePicker'
import tools from '../CustomFieldTools'

function CustomFieldDATI(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues, UoM} = props
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            children={children}
            elementInfo={elementInfo}
            valueKey="value"
            options={lookupValues && lookupValues[customField.code]}
            value={customField.value}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMDateTimePicker
                children={children}
                elementInfo={elementInfo}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"
                endTextAdornment={UoM}/>
        )
    }

}

export default CustomFieldDATI;
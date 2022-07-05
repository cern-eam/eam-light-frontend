import React from 'react';
import EAMInput from 'eam-components/ui/components/muiinputs/EAMInput'
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';

function CustomFieldCHAR(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues, UoM} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            children={children}
            elementInfo={elementInfo}
            valueKey="value"
            values={lookupValues && lookupValues[customField.code]}
            value={customField.value}
            updateProperty={updateCustomFieldValue}
        />
    } else {
        return (
            <EAMInput
                children={children}
                elementInfo={elementInfo}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"
                readonly={props.readonly}
                endTextAdornment={UoM}/>
        )
    }

}

export default React.memo(CustomFieldCHAR);
import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import tools from '../CustomFieldTools'
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

function CustomFieldDATE(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues, UoM} =props;
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            {...processElementInfo(elementInfo)}
            valueKey="value"
            options={lookupValues && lookupValues[customField.code]}
            value={customField.value}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMDatePicker
                {...processElementInfo(elementInfo)}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"
                endTextAdornment={UoM}/>
        )
    }

}

export default CustomFieldDATE;
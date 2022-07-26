import React from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

function CustomFieldCODE(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            {...processElementInfo(elementInfo)}
            value={customField.value}
            valueKey="value"
            desc={customField.valueDesc}
            descKey="valueDesc"
            options={lookupValues && lookupValues[customField.code]}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMTextField
                {...processElementInfo(elementInfo)}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"/>
        )
    }

}

export default CustomFieldCODE;
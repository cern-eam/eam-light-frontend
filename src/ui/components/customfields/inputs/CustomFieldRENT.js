import React from 'react';
import EAMAutocomplete from 'eam-components/ui/components/muiinputs/EAMAutocomplete'
import WSCustomFields from "../../../../tools/WSCustomFields";

function CustomFieldRENT(props) {

    let {customField, updateCustomFieldValue, elementInfo, children} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};
    return (
        <EAMAutocomplete children={children}
                         elementInfo={elementInfo}
                         value={customField.value}
                         valueDesc={customField.valueDesc}
                         updateProperty={updateCustomFieldValue}
                         valueKey="value"
                         descKey="valueDesc"
                         autocompleteHandler={(filter, config) => WSCustomFields.autocompleteCustomFieldRENT(customField.rentCodeValue, filter, config)}
        />
    )
}

export default CustomFieldRENT;
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import React from 'react';
import WSCustomFields from "../../../../tools/WSCustomFields";

function CustomFieldRENT(props) {

    let {customField, updateCustomFieldValue, elementInfo, children} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};
    return (
        <EAMAutocomplete children={children}
                         elementInfo={elementInfo}
                         value={customField.value}
                         desc={customField.valueDesc}
                         updateProperty={updateCustomFieldValue}
                         valueKey="value"
                         descKey="valueDesc"
                         autocompleteHandler={(filter, config) => WSCustomFields.autocompleteCustomFieldRENT(customField.rentCodeValue, filter, config)}
        />
    )
}

export default CustomFieldRENT;
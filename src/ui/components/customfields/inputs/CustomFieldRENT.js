import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import React from 'react';
import WSCustomFields from "../../../../tools/WSCustomFields";

function CustomFieldRENT(props) {

    let {customField, updateCustomFieldValue, elementInfo, children} = props;
    elementInfo = {...elementInfo, readonly: props.readonly};
    return (
        <EAMAutocomplete {...processElementInfo(elementInfo)}
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
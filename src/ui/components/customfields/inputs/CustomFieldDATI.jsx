import React from 'react';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker'
import tools from '../CustomFieldTools'
import { cfDateTime } from '../../../../tools/WSCustomFields';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

function CustomFieldDATI({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.DATETIMEFIELD`);

    if (tools.isLookupCustomField(customField)) {
        return <EAMComboAutocomplete {...extraProps}  
                          validate={validate}
                          autocompleteHandler={cfDateTime}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}
                          renderValue={(value) => value.desc}/>
    } else {
        return (
            <EAMDateTimePicker {...extraProps}/>
        )
    }

}

export default CustomFieldDATI;
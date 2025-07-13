import React from 'react';
import tools from '../CustomFieldTools'
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { cfChar } from '../../../../tools/WSCustomFields';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

function CustomFieldCHAR({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.TEXTFIELD`);

    if (tools.isLookupCustomField(customField)) {
        return <EAMComboAutocomplete {...extraProps}
                          endTextAdornment={customField.UOM}
                          autocompleteHandler={cfChar}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}
                          validate={validate}
                          selectMode={true}
        />
    } else {
        return (
            <EAMTextField {...extraProps} 
                          endTextAdornment={customField.UOM}/>
        )
    }

}

export default CustomFieldCHAR;
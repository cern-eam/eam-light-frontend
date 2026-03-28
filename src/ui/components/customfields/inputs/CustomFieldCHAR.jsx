import React from 'react';
import tools from '../CustomFieldTools'
import { cfChar } from '../../../../tools/WSCustomFields';
import EAMInput from '../../../components/EAMInput';

function CustomFieldCHAR({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.TEXTFIELD`);

    if (tools.isLookupCustomField(customField)) {
        return <EAMInput {...extraProps}
                          endTextAdornment={customField.UOM}
                          autocompleteHandler={cfChar}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}
                          validate={validate} />
    } else {
        return (
            <EAMInput {...extraProps} 
                          endTextAdornment={customField.UOM}/>
        )
    }

}

export default CustomFieldCHAR;
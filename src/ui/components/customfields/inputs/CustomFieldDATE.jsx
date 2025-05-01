import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import tools from '../CustomFieldTools'
import { cfDate } from '../../../../tools/WSCustomFields';
import { useCustomFieldOptions } from '../tools/useCustomFieldOptions';

function CustomFieldDATE({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.DATEFIELD`);
    const options = useCustomFieldOptions(cfDate, customField.PROPERTYCODE)

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...extraProps}
                          options={options}
                          endTextAdornment={customField.UOM}
                          validate={validate}
                          renderValue={(value) => value.desc}/>
    } else {
        return (
            <EAMDatePicker {...extraProps} 
                        endTextAdornment={customField.UOM}/>
        )
    }

}

export default CustomFieldDATE;
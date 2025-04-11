import React from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { cfNum } from '../../../../tools/WSCustomFields';
import { useCustomFieldOptions } from '../tools/useCustomFieldOptions';

function CustomFieldNUM({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.NUMBERFIELD`);

    const options = useCustomFieldOptions(cfNum, customField.PROPERTYCODE)

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...extraProps}
                          options={options}
                          endTextAdornment={customField.UOM}
                          validate={validate}/>
    } else {
        return (
            <EAMTextField {...extraProps}
                          endTextAdornment={customField.UOM}/>
        )
    }

}

export default CustomFieldNUM;
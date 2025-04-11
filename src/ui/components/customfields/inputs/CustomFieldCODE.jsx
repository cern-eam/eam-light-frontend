import React, { useEffect, useState } from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { cfCodeDesc } from '../../../../tools/WSCustomFields';
import { useCustomFieldOptions } from '../tools/useCustomFieldOptions';

function CustomFieldCODE({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.CODEDESCFIELD.CODEVALUE`);
    const options = useCustomFieldOptions(cfCodeDesc, customField.PROPERTYCODE)

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...extraProps}
                          options={options}
                          validate={validate}/>
    } else {
        return (
            <EAMTextField {...extraProps}/>
        )
    }

}

export default CustomFieldCODE;
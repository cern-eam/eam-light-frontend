import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker'
import tools from '../CustomFieldTools'
import { cfDateTime } from '../../../../tools/WSCustomFields';
import { useCustomFieldOptions } from '../tools/useCustomFieldOptions';

function CustomFieldDATI({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.DATETIMEFIELD`);
    const options = useCustomFieldOptions(cfDateTime, customField.PROPERTYCODE)

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...extraProps}     
                          options={options}
                          validate={validate}
                          renderValue={(value) => value.desc}/>
    } else {
        return (
            <EAMDateTimePicker {...extraProps}/>
        )
    }

}

export default CustomFieldDATI;
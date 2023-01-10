import React from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

function CustomFieldCODE({customField, lookupValues, register, index}) {

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...register(customField.code, `customField.${index}.value`)}
                          options={lookupValues && lookupValues[customField.code]}/>
    } else {
        return (
            <EAMTextField {...register(customField.code, `customField.${index}.value`)}/>
        )
    }

}

export default CustomFieldCODE;
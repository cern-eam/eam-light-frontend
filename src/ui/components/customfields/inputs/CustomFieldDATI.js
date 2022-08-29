import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker'
import tools from '../CustomFieldTools'

function CustomFieldDATI({customField, lookupValues, UoM, register, index}) {

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...register(customField.code, `customField.${index}.value`)}     
                          options={lookupValues && lookupValues[customField.code]}/>
    } else {
        return (
            <EAMDateTimePicker {...register(customField.code, `customField.${index}.value`)}/>
        )
    }

}

export default CustomFieldDATI;
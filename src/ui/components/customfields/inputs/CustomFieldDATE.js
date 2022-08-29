import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import tools from '../CustomFieldTools'

function CustomFieldDATE({customField, lookupValues, UoM, register, index}) {

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...register(customField.code, `customField.${index}.value`)}
                          options={lookupValues && lookupValues[customField.code]}
                          endTextAdornment={UoM}/>
    } else {
        return (
            <EAMDatePicker {...register(customField.code, `customField.${index}.value`)} endTextAdornment={UoM}/>
        )
    }

}

export default CustomFieldDATE;
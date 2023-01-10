import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import tools from '../CustomFieldTools'

function CustomFieldDATE({customField, lookupValues, register, index}) {

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...register(customField.code, `customField.${index}.value`)}
                          options={lookupValues && lookupValues[customField.code]}
                          endTextAdornment={customField.uom}/>
    } else {
        return (
            <EAMDatePicker {...register(customField.code, `customField.${index}.value`)} 
                        endTextAdornment={customField.uom}/>
        )
    }

}

export default CustomFieldDATE;
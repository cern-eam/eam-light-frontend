import React from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

function CustomFieldCHAR({customField, lookupValues, register, index}) {

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...register(customField.code, `customField.${index}.value`)}
                          options={lookupValues && lookupValues[customField.code]}
                          endTextAdornment={customField.uom}
        />
    } else {
        return (
            <EAMTextField {...register(customField.code, `customField.${index}.value`)} 
                          endTextAdornment={customField.uom}/>
        )
    }

}

export default React.memo(CustomFieldCHAR);
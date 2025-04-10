import React, { useEffect, useState } from 'react';
import tools from '../CustomFieldTools'
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { cfNum } from '../../../../tools/WSCustomFields';

function CustomFieldNUM({customField, lookupValues, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.NUMBERFIELD`);

    const [options, setOptions] = useState([])  

    useEffect(() => {
        cfNum(customField.PROPERTYCODE).then((response) => {
        setOptions(response.body.data);
      });
    }, [])

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect {...extraProps}
                          options={options}
                          endTextAdornment={customField.uom}
                          validate={validate}/>
    } else {
        return (
            <EAMTextField {...extraProps}
                          endTextAdornment={customField.uom}/>
        )
    }

}

export default CustomFieldNUM;
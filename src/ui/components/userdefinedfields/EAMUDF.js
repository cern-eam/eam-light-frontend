import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React from 'react';
import WSUDF from "tools/WSUDF";

const NONE = 'NONE';
const CODE = 'CODE';
const CODEDESC = 'CODEDESC';
const RENT = 'RENT';

const EAMUDF = (props) => {

    const {udfLookupType, udfLookupEntity, elementId, fieldType} = props.elementInfo;

    if (fieldType === 'checkbox') {
        return (
            <EAMCheckbox {...props}/>
        )
    }

    if (fieldType === 'date') {
        return (
            <EAMDateTimePicker {...props}/>
        )
    }

    switch (udfLookupType) {
        case CODE:
            return (
                <EAMSelect
                    {...props}
                    autocompleteHandler={WSUDF.getUDFCodeValues}
                    autocompleteHandlerParams={[udfLookupEntity, elementId]}
                />)
        case CODEDESC:
            return (
                <EAMSelect
                    {...props}
                    autocompleteHandler={WSUDF.getUDFCodeDescValues}
                    autocompleteHandlerParams={[udfLookupEntity, elementId]}
                />)
        case RENT:
            return (<EAMAutocomplete
                    {...props}
                    autocompleteHandler={WSUDF.autocompleteUserDefinedField}
                    autocompleteHandlerParams={[udfLookupEntity]}
                />)
        case NONE:
        default:
            
            return (<EAMTextField
                    {...props}
                    endTextAdornment={props.elementInfo.udfUom}
                />)
    }
}

export default EAMUDF;
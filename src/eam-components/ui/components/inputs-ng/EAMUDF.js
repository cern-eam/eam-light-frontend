import React from 'react';
import WSUDF from "tools/WSUDF";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { areEqual } from './tools/input-tools';

const NONE = 'NONE';
const CODE = 'CODE';
const CODEDESC = 'CODEDESC';
const RENT = 'RENT';

const EAMUDF = (props) => {

    const {elementInfo, valueKey, value, descKey, desc, updateProperty} = props;
    const {udfLookupType, udfLookupEntity, elementId} = elementInfo;

    switch (udfLookupType) {
        case CODE:
            return (
                <EAMSelect
                    elementInfo={elementInfo}
                    valueKey={valueKey}
                    value={value}
                    updateProperty={updateProperty}
                    autocompleteHandler={WSUDF.getUDFCodeValues}
                    autocompleteHandlerParams={[udfLookupEntity, elementId]}
                />)
        case CODEDESC:
            return (
                <EAMSelect
                    elementInfo={elementInfo}
                    valueKey={valueKey}
                    value={value}
                    updateProperty={updateProperty}
                    autocompleteHandler={WSUDF.getUDFCodeDescValues}
                    autocompleteHandlerParams={[udfLookupEntity, elementId]}
                />)
        case RENT:
            return (<EAMAutocomplete
                    elementInfo={elementInfo}
                    valueKey={valueKey}
                    value={value}
                    descKey={descKey}
                    desc={desc}
                    updateProperty={updateProperty}
                    autocompleteHandler={WSUDF.autocompleteUserDefinedField}
                    autocompleteHandlerParams={[udfLookupEntity]}
                />)
        case NONE:
        default:
            return (<EAMTextField
                    elementInfo={elementInfo}
                    valueKey={valueKey}
                    value={value}
                    updateProperty={updateProperty}
                />)
    }
}

export default React.memo(EAMUDF, areEqual);
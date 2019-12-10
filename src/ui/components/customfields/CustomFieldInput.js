import React, {Component} from 'react';
import CustomFieldRENT from './inputs/CustomFieldRENT'
import CustomFieldCHAR from './inputs/CustomFieldCHAR'
import CustomFieldDATE from './inputs/CustomFieldDATE'
import CustomFieldDATI from './inputs/CustomFieldDATI'
import CustomFieldNUM from './inputs/CustomFieldNUM'
import CustomFieldCODE from './inputs/CustomFieldCODE'

function CustomFieldInput(props) {

    let {customField, children, updateCustomFieldValue, updateCustomFieldDesc, index, lookupValues, readonly} = props

    let generateFieldInfo = () => {
        return {
            text: customField.label,
            elementId: customField.code,
            xpath: 'CF_' + customField.code
        }
    }

    let renderCustomFieldSpecificInput = () => {
        let props = {
            children: children,
            customField: customField,
            updateCustomFieldValue: updateCustomFieldValue,
            updateCustomFieldDesc: updateCustomFieldDesc,
            index: index,
            lookupValues: lookupValues,
            elementInfo: generateFieldInfo(),
            readonly: readonly,
        };

        switch (customField.type) {
            case "RENT":
                return <CustomFieldRENT {...props}/>;
            case "CHAR":
                return <CustomFieldCHAR {...props}/>;
            case "DATE":
                return <CustomFieldDATE {...props}/>;
            case "DATI":
                return <CustomFieldDATI {...props}/>;
            case "NUM":
                return <CustomFieldNUM {...props}/>;
            case "CODE":
                return <CustomFieldCODE {...props}/>;
            default:
                return <div/>
        }

    }

    return renderCustomFieldSpecificInput()

}

export default CustomFieldInput;
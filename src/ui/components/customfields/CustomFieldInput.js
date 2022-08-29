import React from 'react';
import CustomFieldRENT from './inputs/CustomFieldRENT'
import CustomFieldCHAR from './inputs/CustomFieldCHAR'
import CustomFieldDATE from './inputs/CustomFieldDATE'
import CustomFieldDATI from './inputs/CustomFieldDATI'
import CustomFieldNUM from './inputs/CustomFieldNUM'
import CustomFieldCODE from './inputs/CustomFieldCODE'

const groupLabelStyle = {
    "marginTop": 17,
    "marginBottom": 5,
    "fontWeight": "900",
    "color": "rgb(52 111 151)",
    "fontSize": "0.90rem",
    "flex": "1 1 auto",
    "textAlign": "center"
}
function CustomFieldInput(props) {

    let {customField, children, updateCustomFieldValue, updateCustomFieldDesc, index, lookupValues, readonly} = props

    let generateFieldInfo = () => {
        return {
            text: customField.label,
            elementId: customField.code,
            xpath: 'EAMID_' + customField.code,
            fieldType: customField.type === 'NUM' ? 'number' : 'text'
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
            UoM: customField.uom
        };

        let customFieldRender;
        switch (customField.type) {
            case "RENT":
                customFieldRender = <CustomFieldRENT {...props}/>;
                break;
            case "CHAR":
                customFieldRender = <CustomFieldCHAR {...props}/>;
                break;
            case "DATE":
                customFieldRender = <CustomFieldDATE {...props}/>;
                break;
            case "DATI":
                customFieldRender = <CustomFieldDATI {...props}/>;
                break;
            case "NUM":
                customFieldRender = <CustomFieldNUM {...props}/>;
                break;
            case "CODE":
                customFieldRender = <CustomFieldCODE {...props}/>;
                break;
            default:
                customFieldRender = <div/>;
                break;
        }
        return <>
            {customField.groupLabel && <div style={groupLabelStyle}>{customField.groupLabel}</div>}
            {customFieldRender}
        </>
    }

    return renderCustomFieldSpecificInput()

}

export default CustomFieldInput;
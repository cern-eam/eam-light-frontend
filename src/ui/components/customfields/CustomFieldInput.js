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

    let {customField, index, lookupValues, register} = props

    let renderCustomFieldSpecificInput = () => {
        let props = {
            register: register,
            customField: customField,
            index: index,
            lookupValues: lookupValues
        };

        let customFieldRender;
        switch (customField.type) {
            case "RENT":
                 customFieldRender = <CustomFieldRENT {...props} register={register}/>;
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
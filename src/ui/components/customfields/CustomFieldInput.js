import React, {Component} from 'react';
import CustomFieldRENT from './inputs/CustomFieldRENT'
import CustomFieldCHAR from './inputs/CustomFieldCHAR'
import CustomFieldDATE from './inputs/CustomFieldDATE'
import CustomFieldDATI from './inputs/CustomFieldDATI'
import CustomFieldNUM from './inputs/CustomFieldNUM'
import CustomFieldCODE from './inputs/CustomFieldCODE'

class CustomFieldInput extends Component {

    generateFieldInfo() {
        let {customField} = this.props
        return {
            text: customField.label,
            elementId: customField.code,
            xpath: 'CF_' + customField.code
        }
    }

    renderCustomFieldSpecificInput() {
        let props = {
            children: this.props.children,
            customField: this.props.customField,
            updateCustomFieldValue: this.props.updateCustomFieldValue,
            updateCustomFieldDesc: this.props.updateCustomFieldDesc,
            index: this.props.index,
            lookupValues: this.props.lookupValues,
            elementInfo: this.generateFieldInfo(),
            readonly:this.props.readonly,
        };
        let {customField} = this.props;

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

    render() {
        return this.renderCustomFieldSpecificInput()
    }
}

export default CustomFieldInput;
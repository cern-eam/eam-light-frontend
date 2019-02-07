import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import tools from '../CustomFieldTools'

class CustomFieldDATE extends Component {

    render() {
        let {customField, updateCustomFieldValue, elementInfo, children} = this.props;
        elementInfo = {...elementInfo, readonly: this.props.readonly};

        if (tools.isLookupCustomField(customField)) {
            return <EAMSelect
                children={children}
                elementInfo={elementInfo}
                valueKey="value"
                values={this.props.lookupValues[customField.code]}
                value={customField.value}
                updateProperty={updateCustomFieldValue}/>
        } else {
            return (
                <EAMDatePicker
                    children={children}
                    elementInfo={elementInfo}
                    value={customField.value}
                    updateProperty={updateCustomFieldValue}
                    valueKey="value"/>
            )
        }
    }
}

export default CustomFieldDATE;
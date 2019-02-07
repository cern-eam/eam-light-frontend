import React, {Component} from 'react';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSCustomFields from "../../../../tools/WSCustomFields";

class CustomFieldRENT extends Component {

    render() {
        let {customField, updateCustomFieldValue, elementInfo, children} = this.props;
        elementInfo = {...elementInfo, readonly: this.props.readonly};
        return (
            <EAMAutocomplete children={children}
                             elementInfo={elementInfo}
                             value={customField.value}
                             valueDesc={customField.valueDesc}
                             updateProperty={updateCustomFieldValue}
                             valueKey="value"
                             descKey="valueDesc"
                             autocompleteHandler={(filter, config) => WSCustomFields.autocompleteCustomFieldRENT(customField.rentCodeValue, filter, config)}
            />
        )
    }
}

export default CustomFieldRENT;
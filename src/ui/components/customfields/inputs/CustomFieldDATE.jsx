import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import tools from '../CustomFieldTools'
import { cfDate } from '../../../../tools/WSCustomFields';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

function CustomFieldDATE({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, `USERDEFINEDAREA.CUSTOMFIELD.${index}.DATEFIELD`);
    
    if (tools.isLookupCustomField(customField)) {
        return <EAMComboAutocomplete {...extraProps}
                          endTextAdornment={customField.UOM}
                          validate={validate}
                          renderValue={(value) => value.desc}
                          autocompleteHandler={cfDate}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}/>
    } else {
        return (
            <EAMDatePicker {...extraProps} 
                        endTextAdornment={customField.UOM}/>
        )
    }

}

export default CustomFieldDATE;
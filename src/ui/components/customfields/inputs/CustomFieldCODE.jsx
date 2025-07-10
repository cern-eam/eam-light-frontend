import tools from '../CustomFieldTools'
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { cfCodeDesc } from '../../../../tools/WSCustomFields';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

function CustomFieldCODE({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, 
                                `USERDEFINEDAREA.CUSTOMFIELD.${index}.CODEDESCFIELD.CODEVALUE`,
                                `USERDEFINEDAREA.CUSTOMFIELD.${index}.CODEDESCFIELD.DESCRIPTION`);

    if (tools.isLookupCustomField(customField)) {
        return <EAMComboAutocomplete 
                          {...extraProps}
                          validate={validate}
                          autocompleteHandler={cfCodeDesc}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}
                          selectMode={true}/>
    } else {
        return (
            <EAMTextField {...extraProps}/>
        )
    }

}

export default CustomFieldCODE;
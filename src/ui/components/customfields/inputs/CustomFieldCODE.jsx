import tools from '../CustomFieldTools'
import { cfCodeDesc } from '../../../../tools/WSCustomFields';
import EAMInput from '../../../components/EAMInput';

function CustomFieldCODE({customField, register, index, validate}) {
    const extraProps = register(customField.PROPERTYCODE, 
                                `USERDEFINEDAREA.CUSTOMFIELD.${index}.CODEDESCFIELD.CODEVALUE`);

    if (tools.isLookupCustomField(customField)) {
        return <EAMInput 
                          {...extraProps}
                          validate={validate}
                          autocompleteHandler={cfCodeDesc}
                          autocompleteHandlerParams={[customField.PROPERTYCODE]}/>
    } else {
        return (
            <EAMInput {...extraProps}/>
        )
    }

}

export default CustomFieldCODE;
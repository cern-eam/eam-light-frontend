import React from 'react';
import { autocompleteCustomFieldRENT } from '../../../../tools/WSCustomFields';
import EAMInput from '../../../components/EAMInput';

function CustomFieldRENT({customField, register, index}) {
    
    return (
        <EAMInput {...register(customField.PROPERTYCODE, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.CODEVALUE`, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.DESCRIPTION`)}
                         autocompleteHandler={autocompleteCustomFieldRENT}
                         autocompleteHandlerParams={[customField.entity, customField.ENTITYCODEFIELD.entity, customField.PROPERTYCODE]}
        />
    )
}

export default CustomFieldRENT;
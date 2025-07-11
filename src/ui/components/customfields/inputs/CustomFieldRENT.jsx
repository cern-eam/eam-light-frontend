import React from 'react';
import { autocompleteCustomFieldRENT } from '../../../../tools/WSCustomFields';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

function CustomFieldRENT({customField, register, index}) {
    
    return (
        <EAMComboAutocomplete {...register(customField.PROPERTYCODE, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.CODEVALUE`, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.DESCRIPTION`)}
                         autocompleteHandler={autocompleteCustomFieldRENT}
                         autocompleteHandlerParams={[customField.entity, customField.ENTITYCODEFIELD.entity, customField.PROPERTYCODE]}
        />
    )
}

export default CustomFieldRENT;
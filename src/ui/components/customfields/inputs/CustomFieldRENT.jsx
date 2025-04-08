import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import React from 'react';
import WSCustomFields from "../../../../tools/WSCustomFields";

function CustomFieldRENT({customField, register, index}) {
    
    return (
        <EAMAutocomplete {...register(customField.PROPERTYCODE, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.CODEVALUE`, 
                                     `USERDEFINEDAREA.CUSTOMFIELD.${index}.ENTITYCODEFIELD.DESCRIPTION`)}
                         autocompleteHandler={WSCustomFields.autocompleteCustomFieldRENT}
                         autocompleteHandlerParams={[customField.entity, customField.ENTITYCODEFIELD.entity, customField.PROPERTYCODE]}
        />
    )
}

export default CustomFieldRENT;
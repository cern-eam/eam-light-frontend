import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import React from 'react';
import WSCustomFields from "../../../../tools/WSCustomFields";

function CustomFieldRENT({customField, register, index}) {

    return (
        <EAMAutocomplete {...register(customField.code, `customField.${index}.value`, `customField.${index}.valueDesc`)}
                         autocompleteHandler={WSCustomFields.autocompleteCustomFieldRENT}
                         autocompleteHandlerParams={[customField.rentCodeValue]}
        />
    )
}

export default CustomFieldRENT;
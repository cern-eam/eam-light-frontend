import React, {useState, useEffect} from 'react';
import CustomFieldInput from './CustomFieldInput';
import WSCustomFields from "../../../tools/WSCustomFields";
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'
import { isCernMode } from "../CERNMode"

function CustomFields(props) {
    let [lookupValues, setLookupValues] = useState(null);
    let {customFields, classCode, entityCode, register} = props;

    useEffect(() => {
        if (customFields) {
            fetchLookupValues(entityCode, classCode)
        }
    },[entityCode, classCode])

    let fetchLookupValues = (entityCode, classCode) => {
        WSCustomFields.getCustomFieldsLookupValues(entityCode, classCode)
            .then(response => setLookupValues(response.body.data))
            .catch(console.error)
    }

    const isEmptyState = !customFields || customFields.length === 0;
    return (
        isEmptyState
        ? <SimpleEmptyState message="No Custom Fields to show." />
        : (
            <React.Fragment>
                {customFields.map((customField, index) => {
                    {/* The custom fields starting with MTFX were temporarily used to have a similar functionality to
                        the Line Title in the Associate Custom Fields screen of Infor EAM. They may now be hidden. */}
                    if (isCernMode && customField.code.startsWith('MTFX')) return null;
                    return (
                        <CustomFieldInput
                            register={register}
                            customField={customField}
                            index={index}
                            key={index}
                            lookupValues={lookupValues}
                        />
                    )
                })}
            </React.Fragment>
        )
    )

}

CustomFields.defaultProps = {
    title: 'CUSTOM FIELDS'
};

export default React.memo(CustomFields);
import React, {useState, useEffect} from 'react';
import CustomFieldInput from './CustomFieldInput';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'

function CustomFields(props) {
    let [lookupValues, setLookupValues] = useState(null);
    let {customFields, register} = props;

    const isEmptyState = customFields && customFields.length === 0;

    return (
        isEmptyState
        ? <SimpleEmptyState message="No Custom Fields to show." />
        : !customFields ? <SimpleEmptyState message="Loading..." />
        : (
            <React.Fragment>
                {customFields.map((customField, index) => {
                    {/* The custom fields starting with MTFX were temporarily used to have a similar functionality to
                        the Line Title in the Associate Custom Fields screen of Infor EAM. They may now be hidden.
                        TODO: return null also when 'isCernMode'
                    */}
                    if (customField.PROPERTYCODE.startsWith('MTFX')) return null;
                    return (
                        <CustomFieldInput
                            register={(...props) => ({
                                label: customField?.label,
                                xpath: 'EAMID_' + customField?.code,
                                fieldType: customField?.type === 'NUM' ? 'number' : 'text',
                                ...register?.(...props) ?? {}
                            })}
                            customField={customField}
                            index={index}
                            key={index}
                            lookupValues={lookupValues}
                            validate={customField.lovValidate === '+'}
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
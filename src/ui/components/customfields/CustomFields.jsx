import React from 'react';
import CustomFieldInput from './CustomFieldInput';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'

function CustomFields(props) {
    let {customFields, register} = props;

    return (
        !customFields
        ? <SimpleEmptyState message="No Custom Fields to show." />
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
                            register={register}
                            customField={customField}
                            index={index}
                            key={index}
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
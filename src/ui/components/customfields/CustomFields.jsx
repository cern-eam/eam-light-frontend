import React, {useState, useEffect} from 'react';
import CustomFieldInput from './CustomFieldInput';
import WSCustomFields from "../../../tools/WSCustomFields";
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'

function CustomFields(props) {
    let [lookupValues, setLookupValues] = useState(null);
    let {customFields, classCode, entityCode, register, fetchCustomFields = false} = props;

    const [cfs, setCfs] = useState();
    useEffect(() => {
        const loadCFList = async () => {
            try {
                const customfs = (await WSCustomFields.getCustomFields(entityCode, classCode)).body.data ;
                setCfs(customfs);
            } catch (err) {
                props.handleError?.(err)
            }
        }
        if (fetchCustomFields) {
            loadCFList();
        }
    }, [entityCode, classCode])


    useEffect(() => {
        if (customFields || cfs) {
            fetchLookupValues(entityCode, classCode)
        }
    }, [entityCode, classCode, cfs])

    let fetchLookupValues = (entityCode, classCode) => {
        WSCustomFields.getCustomFieldsLookupValues(entityCode, classCode)
            .then(response => setLookupValues(response.body.data))
            .catch(console.error)
    }

    const isEmptyState = customFields && customFields.length === 0 || cfs && cfs.length === 0;

    const fetchedCustomFields = customFields || cfs;
    return (
        isEmptyState
        ? <SimpleEmptyState message="No Custom Fields to show." />
        : !fetchedCustomFields ? <SimpleEmptyState message="Loading..." />
        : (
            <React.Fragment>
                {fetchedCustomFields.map((customField, index) => {
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
import React, {useState, useEffect} from 'react';
import CustomFieldInput from './CustomFieldInput';
import WSCustomFields from "../../../tools/WSCustomFields";
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'

function CustomFields(props) {
    let [lookupValues, setLookupValues] = useState(null);
    let {updateEntityProperty, customFields, readonly, children, classCode, entityCode} = props;


    useEffect(() => {
        if (customFields) {
            fetchLookupValues(entityCode, classCode)
        }
    },[customFields])


    // Class has changed, but the entity key code did not; update custom fields
    useEffect(() => {
        if (lookupValues) {
            updateCustomFields(entityCode, classCode)
        }
    },[entityCode, classCode])

    let fetchLookupValues = (entityCode, classCode) => {
        WSCustomFields.getCustomFieldsLookupValues(entityCode, classCode)
            .then(response => setLookupValues(response.body.data))
    }

    let updateCustomFields = (entityCode, classCode) => {
        WSCustomFields.getCustomFields(entityCode, classCode)
            .then(response => {
                let newCustomFields = response.body.data
                for (var i = 0; i < newCustomFields.length; i++) {
                    var temp = customFields.find(cf => (cf.code === newCustomFields[i].code));
                    if (temp) {
                        newCustomFields[i].value = temp.value;
                    }
                }
                updateEntityProperty('customField', newCustomFields)
            })
    }

    let updateCustomFieldValue = (index, valueKey, value) => {
        updateEntityProperty(`customField.${index}.${valueKey}`, value)
    }

    const isEmptyState = !customFields || customFields.length === 0;
    return (
        isEmptyState
        ? <SimpleEmptyState message="No Custom Fields to show." />
        : (
            <div style={{width: "100%", marginTop: 0}}>
                {customFields.map((customField, index) => (
                        <CustomFieldInput children={children}
                                            key={index}
                                            updateCustomFieldValue={updateCustomFieldValue.bind(null, index)}
                                            customField={customField}
                                            index={index}
                                            lookupValues={lookupValues}
                                            readonly={readonly}/>
                    ))
                }
            </div>
        )
    )

}

CustomFields.defaultProps = {
    title: 'CUSTOM FIELDS',
    readonly: false,
};

export default React.memo(CustomFields);
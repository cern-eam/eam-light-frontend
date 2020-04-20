
import set from "set-value";

// clones an entity deeply
export const cloneEntity = entity => ({
    ...entity,
    userDefinedFields: {
        ...(entity.userDefinedFields || {})
    },
    customField: [
        ...(entity.customField || []).map(cf => ({...cf}))
    ]
});

// assigns the user defined fields from userDefinedFields to the entity
export const assignUserDefinedFields = (entity, userDefinedFields) => {
    const newEntity = cloneEntity(entity);
    newEntity.userDefinedFields = Object.assign({}, 
        ...Object.entries(newEntity.userDefinedFields)
            .map(([key, value]) => ({[key]: value ? value : userDefinedFields[key]})));
    return newEntity;

}

// assigns the custom fields from the customField object to the ones that are present in the entity
// if the specified custom fields are not present in the entity, nothing is done
export const assignCustomField = (entity, customField) => {
    const newEntity = cloneEntity(entity);
    newEntity.customField = newEntity.customField.map(cf => ({...cf,
        value: ((customField || []).find(cf2 => cf.code === cf2.code) || {}).value || cf.value
    }));
    return newEntity;
}

// assigns the custom fields from the customField object to the entity, merging old values
export const assignNewCustomField = (entity, customField) => {
    const newEntity = cloneEntity(entity);
    newEntity.customField = customField.map(cf => ({...cf,
        value: ((entity.customField || []).find(cf2 => cf.code == cf2.code) || {}).value || cf.value
    }));
    return newEntity;
}

// assigns the values in values to the entity
// values that do not exist in the entity are not copied
// if the entity has a non-empty value, that value is not copied, unless forced is truthy
export const assignValues = (entity, values, forced) => {
    const newEntity = cloneEntity(entity);
    Object.keys(entity)
        .filter(key => values.hasOwnProperty(key))
        .forEach(key => {
            newEntity[key] = forced || !entity[key] ? values[key] : entity[key];
        });

    return newEntity;
};

export const assignQueryParamValues = (entity, queryParams) => {
    // this function converts an object with case insensitive keys to an object with
    // case sensitive keys, based on a target object
    const toSensitive = (target, insensitive) => {
        const mapping = Object.fromEntries(Object.entries(target)
            .map(([k]) => [k.toLowerCase(), k]));

        return Object.fromEntries(Object.entries(insensitive)
            .map(([key, value]) => [mapping[key.toLowerCase()], value])
            .filter(([key]) => key !== undefined));
    }

    queryParams = {...queryParams};

    // delete values that we cannot touch
    delete queryParams.userDefinedFields;
    delete queryParams.customField;

    entity = assignValues(entity, toSensitive(entity, queryParams));
    entity = assignCustomField(entity, queryParams);

    const userDefinedFields = Object.assign({}, ...Object.entries(queryParams)
        .filter(([key]) => key.toLowerCase().startsWith("udf")) // only include keys prepended with udf
        .map(([key, value]) => ({[key.toLowerCase()]: value}))); // remove udf substring at the beginning from key

    return assignUserDefinedFields(entity, userDefinedFields);
}

export const assignDefaultValues = (entity, layout, layoutPropertiesMap) => {
    // Create an entity-like object with the default values from the screen's layout
    let defaultValues = {};
    if (layout && layoutPropertiesMap) {
        defaultValues = Object.values(layout.fields)
            .filter(field => field.defaultValue && layoutPropertiesMap[field.elementId])
            .map(field => (console.log(field), field))
            .reduce((result, field) => set(result, layoutPropertiesMap[field.elementId], 
                    field.defaultValue === 'NULL' ? '' : field.defaultValue), {});
    }

    entity = assignValues(entity, defaultValues);
    return assignUserDefinedFields(entity, defaultValues.userDefinedFields);
}
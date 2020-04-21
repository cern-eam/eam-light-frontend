
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
export const assignUserDefinedFields = (entity, userDefinedFields, {forced = false} = {}) => {
    const newEntity = cloneEntity(entity);
    let expr = Object.entries(userDefinedFields);

    if(!forced) {
        expr = expr.filter(([key]) => !newEntity.userDefinedFields[key])
    }
    
    expr.forEach(([key, value]) => newEntity.userDefinedFields[key] = value);
    return newEntity;
}

// assigns the custom fields from an object to the ones that are present in the entity
// if the specified custom fields are not present in the entity, nothing is done
export const assignCustomFieldFromObject = (entity, object, {forced = false} = {}) => {
    const newEntity = cloneEntity(entity);
    let expr = newEntity.customField.filter(cf => object[cf.code]);

    if(!forced) {
        expr = expr.filter(cf => !cf.value);
    }

    expr.forEach(cf => cf.value = object[cf.code]);
    return newEntity;
}

// assigns the custom fields from the customField object to the entity, merging old values
export const assignCustomFieldFromCustomField = (entity, customField, {forced = false} = {}) => {
    const newEntity = cloneEntity(entity);
    const oldCustomField = newEntity.customField;
    newEntity.customField = customField.map(cf => ({...cf})); // ensure custom field is not modified

    if(forced) {
        return newEntity;
    }

    const getOldCustomField = ({code}) => oldCustomField.find(cf => code === cf.code);

    newEntity.customField.filter(cf => {
            const field = getOldCustomField(cf);
            return field && field.value;
        }).forEach(cf => cf.value = getOldCustomField(cf).value);

    return newEntity;
}

// assigns the values in values to the entity
// values that do not exist in the entity are not copied
// if the entity has a non-empty value, that value is not copied, unless forced is truthy
export const assignValues = (entity, values, {forced = false} = {}) => {
    const newEntity = cloneEntity(entity);
    let expr = Object.keys(newEntity).filter(key => values.hasOwnProperty(key));

    if(!forced) {
        expr = expr.filter(key => !newEntity[key]);
    }

    expr.forEach(key => newEntity[key] = values[key]);
    return newEntity;
};

export const assignQueryParamValues = (entity, queryParams, config = {forced: true}) => {
    // this function converts an object with case insensitive keys to an object with
    // case sensitive keys, based on a target object
    const toSensitive = (target, insensitive) => {
        const mapping = Object.fromEntries(Object.entries(target)
            .map(([k]) => [k.toLowerCase(), k]));

        return Object.fromEntries(Object.entries(insensitive)
            .map(([key, value]) => [mapping[key.toLowerCase()], value])
            .filter(([key]) => key !== undefined));
    }

    const caseSensitiveQueryParams = toSensitive(entity, queryParams);

    // delete values that we cannot touch
    delete caseSensitiveQueryParams.userDefinedFields;
    delete caseSensitiveQueryParams.customField;

    entity = assignValues(entity, caseSensitiveQueryParams, config);
    entity = assignCustomFieldFromObject(entity, queryParams, config);

    const userDefinedFields = Object.assign({}, ...Object.entries(queryParams)
        .filter(([key]) => key.toLowerCase().startsWith("udf")) // only include keys prepended with udf
        .map(([key, value]) => ({[key.toLowerCase()]: value}))); // remove udf substring at the beginning from key

    return assignUserDefinedFields(entity, userDefinedFields, config);
}

export const assignDefaultValues = (entity, layout, layoutPropertiesMap, config = {forced: true}) => {
    // Create an entity-like object with the default values from the screen's layout
    let defaultValues = {};
    if (layout && layoutPropertiesMap) {
        defaultValues = Object.values(layout.fields)
            .filter(field => field.defaultValue && layoutPropertiesMap[field.elementId])
            .reduce((result, field) => set(result, layoutPropertiesMap[field.elementId], 
                    field.defaultValue === 'NULL' ? '' : field.defaultValue), {});
    }

    entity = assignValues(entity, defaultValues, config);
    return assignUserDefinedFields(entity, defaultValues.userDefinedFields, config);
}
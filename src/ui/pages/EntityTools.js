import set from "set-value";
import queryString from "query-string";
import formatfns from "date-fns/format";
import { parseISO } from "date-fns";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";

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

// There are 3 kinds of entity assignments:
// 1. always copy from source to destination (FORCED)
//      - used when you wish to force an assignment
// 2. copy from source to destination if source is not empty (SOURCE_NOT_EMPTY)
//      - used when you wish to assign only if you have something to assign
//        (trying to assign an empty value to an existing one will not change it)
// 3. copy from source to destination if destination is empty (DESTINATION_EMPTY)
//      - used when you wish to assign only if what you are assigning to is empty
//        (trying to assign an existing value to another existing value will not change it)
export const AssignmentType = {
    FORCED: {
        sourceNotEmpty: false,
        destinationEmpty: false
    },
    SOURCE_NOT_EMPTY: {
        sourceNotEmpty: true,
        destinationEmpty: false
    },
    DESTINATION_EMPTY: {
        sourceNotEmpty: false,
        destinationEmpty: true
    }
    // Note: there is no combination where both sourceNotEmpty and destinationEmpty are true
    // because this is effectively the same as DESTINATION_EMPTY, as if the source is empty,
    // it will not change an empty destination anyway
};

const throwIfInvalidAssignmentType = assignmentType => {
    if(!Object.values(AssignmentType).includes(assignmentType)) {
        throw new Error('You must specify a valid assigment type');
    }
};

// assigns the user defined fields from userDefinedFields to the entity
export const assignUserDefinedFields = (entity, userDefinedFields = {}, assignmentType) => {
    throwIfInvalidAssignmentType(assignmentType);
    const {sourceNotEmpty, destinationEmpty} = assignmentType;

    const newEntity = cloneEntity(entity);
    let expr = Object.entries(userDefinedFields);

    if(sourceNotEmpty) {
        expr = expr.filter(([, value]) => value);
    }

    if(destinationEmpty) {
        expr = expr.filter(([key]) => !newEntity.userDefinedFields[key])
    }

    expr.forEach(([key, value]) => newEntity.userDefinedFields[key] = value);
    return newEntity;
}

// assigns the custom fields from an object to the ones that are present in the entity
// if the specified custom fields are not present in the entity, nothing is done
export const assignCustomFieldFromObject = (entity, object = {}, assignmentType) => {
    throwIfInvalidAssignmentType(assignmentType);
    const {sourceNotEmpty, destinationEmpty} = assignmentType;

    const newEntity = cloneEntity(entity);
    let expr = newEntity.customField.filter(cf => object[cf.code]);

    if(sourceNotEmpty) {
        expr = expr.filter(cf => object[cf.code]);
    }

    if(destinationEmpty) {
        expr = expr.filter(cf => !cf.value);
    }

    expr.forEach(cf => cf.value = object[cf.code]);
    return newEntity;
}

// assigns the custom fields from the customField object to the entity, merging old values
export const assignCustomFieldFromCustomField = (entity, customField = [], assignmentType) => {
    throwIfInvalidAssignmentType(assignmentType);
    const {sourceNotEmpty, destinationEmpty} = assignmentType;

    const newEntity = cloneEntity(entity);
    const oldCustomField = newEntity.customField;
    newEntity.customField = customField.map(cf => ({...cf})); // ensure custom field is not modified

    let expr = newEntity.customField;
    
    if(sourceNotEmpty) {
        expr = expr.filter(cf => !cf.value);
    }

    const getOldCustomFieldValue = ({code}) => {
        const field = oldCustomField.find(cf => code === cf.code);
        return field ? field.value : undefined;
    }

    if(destinationEmpty) {
        expr = expr.filter(cf => getOldCustomFieldValue(cf));
    }
    
    expr.forEach(cf => cf.value = getOldCustomFieldValue(cf));
    return newEntity;
}

// assigns the values in values to the entity
// values that do not exist in the entity are not copied
// if the entity has a non-empty value, that value is not copied, unless forced is truthy
export const assignValues = (entity, values = {}, assignmentType) => {
    throwIfInvalidAssignmentType(assignmentType);
    const {sourceNotEmpty, destinationEmpty} = assignmentType;

    const newEntity = cloneEntity(entity);
    let expr = Object.keys(newEntity).filter(key => values.hasOwnProperty(key));

    if(destinationEmpty) {
        expr = expr.filter(key => !newEntity[key]);
    }

    if(sourceNotEmpty) {
        expr = expr.filter(key => values[key]);
    }

    expr.forEach(key => newEntity[key] = values[key]);
    return newEntity;
};

export const assignQueryParamValues = (entity, assignmentType = AssignmentType.FORCED) => {
    throwIfInvalidAssignmentType(assignmentType);
    let queryParams = queryString.parse(window.location.search);

    const caseSensitiveQueryParams = toSensitive(entity, queryParams);

    // delete values that we cannot touch
    delete caseSensitiveQueryParams.userDefinedFields;
    delete caseSensitiveQueryParams.customField;

    entity = assignValues(entity, caseSensitiveQueryParams, assignmentType);
    entity = assignCustomFieldFromObject(entity, queryParams, assignmentType);

    const userDefinedFields = Object.assign({}, ...Object.entries(queryParams)
        .filter(([key]) => key.toLowerCase().startsWith("udf")) // only include keys prepended with udf
        .map(([key, value]) => ({[key.toLowerCase()]: value}))); // remove udf substring at the beginning from key

    return assignUserDefinedFields(entity, userDefinedFields, assignmentType);
}

export const fireHandlers = (entity, handlers) => {
    let queryParams = queryString.parse(window.location.search);
    const caseSensitiveQueryParams = toSensitive(entity, queryParams);
    for (const param in caseSensitiveQueryParams) {
        handlers?.[param]?.(caseSensitiveQueryParams[param])
    }
}

// this function converts an object with case insensitive keys to an object with
// case sensitive keys, based on a target object
export const toSensitive = (target, insensitive) => {
    const mapping = Object.fromEntries(Object.entries(target)
        .map(([k]) => [k.toLowerCase(), k]));

    return Object.fromEntries(Object.entries(insensitive)
        .map(([key, value]) => [mapping[key.toLowerCase()], value])
        .filter(([key]) => key !== undefined));
}

export const assignDefaultValues = (entity, layout, layoutPropertiesMap, assignmentType = AssignmentType.FORCED) => {
    throwIfInvalidAssignmentType(assignmentType);

    // Create an entity-like object with the default values from the screen's layout
    let defaultValues = {};

    if (layout && layoutPropertiesMap) {
        defaultValues = Object.values(layout.fields)
            .filter(field => field.defaultValue && layoutPropertiesMap[field.elementId])
            .reduce((result, field) => set(result, layoutPropertiesMap[field.elementId], 
                    field.defaultValue === 'NULL' ? '' : field.defaultValue), {});
    }
    
    const userDefinedFields = defaultValues.userDefinedFields;
    delete defaultValues.userDefinedFields;

    entity = assignValues(entity, defaultValues, assignmentType);
    entity = assignUserDefinedFields(entity, userDefinedFields, assignmentType);

    return entity;
}

export const getTabAvailability = (tabs, tabCode) => {
    if(!tabs[tabCode]) return true;
    return tabs[tabCode].tabAvailable;
}

export const getTabInitialVisibility = (tabs, tabCode) => {
    if (!tabs[tabCode]) return true;
    return tabs[tabCode].alwaysDisplayed;
}


export const isDepartmentReadOnly = (departmentCode, userData) => {
    return userData.eamAccount.departmentalSecurity[departmentCode]?.readOnly;
}

export const formatDate = date => format(date, 'dd-MMM-yyyy');

export const formatDateTime = date => format(date, 'dd-MMM-yyyy HH:mm');

const format = (date, dateFormat) => {
    try {
        return formatfns(parseISO(date), dateFormat)
    } catch(error) {
        console.error("formatDate error" + error);
    }

    return null;
}

export const getElementInfoForCustomField = (layoutKey, customFields) => {
    let customField = customFields.find(cf => cf.code === layoutKey) 

    return {
        text: customField?.label,
        xpath: 'EAMID_' + layoutKey,
        fieldType: customField?.type === 'NUM' ? 'number' : 'text'
    }
}

export const registerCustomField = entity => (layoutKey, valueKey, descKey) => {
    let data = processElementInfo(getElementInfoForCustomField(layoutKey, entity.customField))
    data.value = get(entity, valueKey);
    if (descKey) {
        data.desc = get(entity, descKey);
    }
    data.disabled = true;
    return data;
}

export const isMultiOrg = process.env.REACT_APP_MULTI_ORG === 'TRUE';

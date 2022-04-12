import queryString from 'query-string';

const FILTER_SEPARATOR = ':::';
const VALUE_SEPARATOR = ':';
const OPERATOR_SEPARATOR = '|||';

const parseGridFilters = (gridFiltersString) => {
    const adaptGridFilters = ([code, value]) => {
        const [val, operator] = value && value.split(OPERATOR_SEPARATOR);
        return {
            fieldName: code,
            fieldValue: val,
            operator: operator || 'EQUALS',
            joiner: 'AND',
        }
    }

    try {
        return gridFiltersString ?
            gridFiltersString.split(FILTER_SEPARATOR)
                .map(gridFilter => gridFilter.split(VALUE_SEPARATOR))
                .map(adaptGridFilters)
            : [];
    } catch (err) {
        return [];
    }
}

const stringifyGridFilter = gridFilter => {
    return gridFilter.fieldValue ? gridFilter.fieldName + VALUE_SEPARATOR + (gridFilter.fieldValue || '') + OPERATOR_SEPARATOR + gridFilter.operator : ''
}

const stringifyGridFilters = (gridFilters = []) => {
    return gridFilters.map(stringifyGridFilter).join(FILTER_SEPARATOR)
}

const replaceUrlParam = (key, val) => {
    const params = queryString.parse(window.location.search);
    params[key] = val;
    const newParams = queryString.stringify(params, { skipEmptyString: true });
    return newParams ? `?${newParams}` : '';
}

const getURLParameterByName = name => queryString.parse(window.location.search)[name] || '';

export default {
    parseGridFilters,
    getURLParameterByName,
    replaceUrlParam,
    stringifyGridFilters,
}
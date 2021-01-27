const FILTER_SEPARATOR = ':::';
const VALUE_SEPARATOR = ':';
const OPERATOR_SEPARATOR = '|||';

const parseGridFilters = (gridFiltersString) => {
    const adaptGridFilters = (gridFilter = {}) => {
        const value = gridFilter && gridFilter.value.split(OPERATOR_SEPARATOR);
        return {
            fieldName: gridFilter.code,
            fieldValue: value[0],
            joiner: 'AND',
            operator: value[1] || '='
        }
    }

    try {
        return gridFiltersString ?
            gridFiltersString.split(FILTER_SEPARATOR)
                .map(gridFilter =>  (([code, value]) => ({code, value}))(gridFilter.split(VALUE_SEPARATOR)))
                .map(adaptGridFilters)
            : [];
    } catch (err) {
        return [];
    }
}

const stringifyGridFilter = gridFilter => {
    return gridFilter.fieldName + VALUE_SEPARATOR + gridFilter.fieldValue + OPERATOR_SEPARATOR + gridFilter.operator
}

const stringifyGridFilters = (gridFilters = []) => {
    return gridFilters.map(stringifyGridFilter).join(FILTER_SEPARATOR)
}

const replaceUrlParam = (key, val) => {
    const params = window.location.href
            .replace(/[^?]*/, '')
            .split(/[&?]/)
            .filter(el => el[0])
            .map(c => c.split("="))
            .reduce((acc, el) => {acc[el[0]] = el[1]; return acc;}, {})
            ;
    params[key] = encodeURIComponent(val);
    return '?' +
        Object.entries(params)
            .map(el => el[0] + '=' + el[1])
            .reduce((acc, el) => acc ? (acc + '&' + el ) : el, '')
        ;
}

/**
 * To get the value of a parameter from the URL
 * @param name (Key) of the parameter
 * @returns {string} The value of the parameter,or an empty string
 */
const getURLParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export default {
    parseGridFilters,
    getURLParameterByName,
    replaceUrlParam,
    stringifyGridFilters,
}
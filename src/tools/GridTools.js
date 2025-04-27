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
    return gridFilter.fieldName + VALUE_SEPARATOR + (gridFilter.fieldValue || '') + OPERATOR_SEPARATOR + gridFilter.operator
}

const stringifyGridFilters = (gridFilters = []) => {
    return gridFilters.map(stringifyGridFilter).join(FILTER_SEPARATOR)
}

// const replaceUrlParam = (key, val) => {
//     const params = window.location.href
//             .replace(/[^?]*/, '')
//             .split(/[&?]/)
//             .filter(el => el[0])
//             .map(c => c.split("="))
//             .reduce((acc, el) => {acc[el[0]] = el[1]; return acc;}, {})
//             ;
//     params[key] = encodeURIComponent(val);
//     return '?' +
//         Object.entries(params)
//             .map(el => el[0] + '=' + el[1])
//             .reduce((acc, el) => acc ? (acc + '&' + el ) : el, '')
//         ;
// }


const replaceUrlParam = (key, val) => {
    const params = queryString.parse(window.location.search);
    params[key] = val;
    return '?' + queryString.stringify(params);
}

const getURLParameterByName = name => queryString.parse(window.location.search)[name] || '';

export const transformNativeResponse = (response) => {
  const records = response.body.Result.ResultData.DATARECORD ?? []

  return {
    body: {
      data: records.map(record => {
        const obj = {};
        for (const field of record.DATAFIELD) {
          let value = field.FIELDVALUE;

          // Normalize types
          switch (field.DATATYPE) {
            case 'DECIMAL':
            case 'NUMBER':
              value = value === '' ? null : Number(value?.replace(/,/g, ""));
              break;
            case 'CHKBOOLEAN':
              value = value === '' ? null : value === '1';
              break;
            default:
              // Keep VARCHAR, MIXVARCHAR, DATE, etc. as-is
              break;
          }

          obj[field.FIELDNAME] = value;
        }
        return obj;
      }),
    },
  };
};


export default {
    parseGridFilters,
    getURLParameterByName,
    replaceUrlParam,
    stringifyGridFilters,
}
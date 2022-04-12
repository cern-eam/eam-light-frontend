import { findIndex } from './tools';

function getDefaultFilterOperator(dataType) {
    switch(dataType){
        case 'DATE':
            return 'GREATER_THAN';
        case 'DATETIME':
            return 'GREATER_THAN';
        case 'DECIMAL':
            return 'GREATER_THAN';
        case 'NUMBER':
            return 'GREATER_THAN';
        case 'CHKBOOLEAN':
            return 'SELECTED';
        default:
            return 'BEGINS';
    }
}


export function getFilters () {
    return Object.values(this.filterMap)
}

/**
 *
 * @param filter
 */
export function setFilter(filter, dataType) {
    let newFilter;
    let oldFilter = this.filterMap[filter.fieldName];
    if (oldFilter) {
        // Update of existing filter
        newFilter = {
            ...oldFilter,
            ...filter
        }
    } else {
        // Creation of new filter
        newFilter = {
            operator: getDefaultFilterOperator(dataType),
            fieldValue: '',
            joiner: 'AND',
            ...filter
        }
    }
    this.filterMap[filter.fieldName] = newFilter;

}

export function clearFilters(callback) {
    this.filterMap = {}
    this.setState((prevState) => ({
        gridRequest: {
            ...prevState.gridRequest,
            gridSort: [],
            gridFilter: []
        },
        selectedRows: {}
    }), () => {
        // execute callback if any
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

export function saveGridRequestInLocalStorage() {
    // We use local storage unless the user explicitely ask not to
    if(this.props.useLocalStorage !== false) {
        localStorage.setItem(`gridRequest${this.props.gridId}`, JSON.stringify(this.state.gridRequest));
    }
}

export function loadGridRequestFromLocalStorage() {
    // We use local storage unless the user explicitely ask not to
    if(this.props.useLocalStorage !== false) {
        return localStorage.getItem(`gridRequest${this.props.gridId}`);
    }
}
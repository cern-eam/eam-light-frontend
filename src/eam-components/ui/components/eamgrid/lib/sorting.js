import { findIndex } from './tools';

const sortingTypes = ['ASC', 'DESC', undefined];

/**
 * Get next sorting type after prevSortingType
 */
const _getNextSortingType = (prevSortingType) => {
    let i = sortingTypes.indexOf(prevSortingType);
    i = ++i%sortingTypes.length;
    return sortingTypes[i];
}

/**
 * Update State with GridRequest sorting info and reload data
 * @param {object} field
 */
export function toggleSortField(sortinfo) {

    // update the state with sorting info for fields and gridSort in gridRequest
    this.setState((prevState) => {

        // get current index of gridSort for this field
        //let sortingIndex = prevState.gridRequest.gridSort.findIndex(f => f.sortBy === sortinfo.sortBy);
        let sortingIndex = findIndex(prevState.gridRequest.gridSort, 'sortBy', sortinfo.sortBy);

        // new sorting object
        let newSorting = {};
        if(sortingIndex > -1) {
            newSorting = {
                ...prevState.gridRequest.gridSort[sortingIndex],
                ...sortinfo,
                // get next sorting type for this field
                sortType: _getNextSortingType(prevState.gridRequest.gridSort[sortingIndex].sortType)
            };
        } else {
            newSorting = { 'sortType': 'ASC', ...sortinfo }
        }

        // defined new grid sorting
        let newGridSorting = [
            ...prevState.gridRequest.gridSort.slice(0, sortingIndex>0?sortingIndex:0),
            newSorting,
            ...prevState.gridRequest.gridSort.slice(sortingIndex+1)
        ].filter(s => s.sortType);

        return {
            ...prevState,
            'hasMore': true,
            'rows': [],
            'fields': [...prevState.fields],
            'gridRequest': {
                ...prevState.gridRequest,
                'cursorPosition': 1,
                'gridSort': newGridSorting
            }
        }
    }, () => {
        this.loadMoreData();
    });
}
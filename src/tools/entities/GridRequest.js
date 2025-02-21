export const GridTypes = Object.freeze({ LIST: "LIST", LOV: "LOV" });

export default class GridRequest {
    constructor(gridName, gridType = GridTypes.LIST) {
        this.gridName = gridName
        this.gridType = gridType
        this.gridFilter = []
        this.params = {}
        this.gridSort = []
    }

    addFilter(fieldName, fieldValue, operator, joiner = "AND", leftParenthesis = false, rightParenthesis = false) {
        this.gridFilter.push({ fieldName, fieldValue, operator, joiner, leftParenthesis, rightParenthesis });
    }

    addParam(key, value) {
        this.params[key] = value; 
    }

    sortBy(sortBy, sortType = "ASC") {
        this.gridSort.push({ sortBy, sortType });
    }
}

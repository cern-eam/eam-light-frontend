class GridRequest {
    constructor(gridName) {
      this.gridName = gridName;
      this.gridFilter = [];
    }
  
    addFilter(fieldName, fieldValue, operator, joiner = "AND", leftParenthesis = false, rightParenthesis = false) {
      this.gridFilter.push({ fieldName, fieldValue, operator, joiner, leftParenthesis, rightParenthesis });
    }
  }
  
  export default GridRequest;
  
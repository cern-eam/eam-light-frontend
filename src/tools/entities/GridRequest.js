export const GridTypes = Object.freeze({ LIST: "LIST", LOV: "LOV" });

export const GridFilterJoiner = Object.freeze({ AND: "AND", OR: "OR" });

export default class GridRequest {
  constructor(gridName, gridType = GridTypes.LIST, userFunctionName, rowCount = 1000) {
    this.GRID = {
      GRID_NAME: gridName,
      NUMBER_OF_ROWS_FIRST_RETURNED: rowCount,
      WSGRIDSZ_OVERRIDE: rowCount,
      CURSOR_POSITION: 0
    }

    if (userFunctionName) {
      this.GRID.USER_FUNCTION_NAME = userFunctionName
    }

    this.GRID_TYPE = {
      TYPE: gridType
    }

    this.REQUEST_TYPE = "LIST.HEAD_DATA.STORED";
    this.LOCALIZE_RESULT = "false"

    return this;
  }

  setDataspy(dataspyId) {
    this.DATASPY = {
      DATASPY_ID: dataspyId
    };

    return this;
  }
  
  setRowCount(rowCount) {
    this.GRID.NUMBER_OF_ROWS_FIRST_RETURNED = rowCount;
    this.GRID.WSGRIDSZ_OVERRIDE = rowCount;

    return this;
  }

  addParam(alias, value) {
    if (!this.LOV) {
      this.LOV = {
        LOV_PARAMETERS: {
          LOV_PARAMETER: []
        }
      };
    }

    this.LOV.LOV_PARAMETERS.LOV_PARAMETER = this.LOV.LOV_PARAMETERS.LOV_PARAMETER
    .filter(param => param.ALIAS_NAME !== alias);
    
    this.LOV.LOV_PARAMETERS.LOV_PARAMETER.push({
      ALIAS_NAME: alias,
      VALUE: value
    });

    return this;
  }

  addFilter(fieldName, fieldValue, operator, joiner = "AND", leftParenthesis = false, rightParenthesis = false) {

    if (!this.MULTIADDON_FILTERS) {
      this.MULTIADDON_FILTERS = {
        MADDON_FILTER: []
      };
    }

    this.MULTIADDON_FILTERS.MADDON_FILTER.push({
      ALIAS_NAME: fieldName,
      VALUE: fieldValue,
      OPERATOR: operator,
      JOINER: joiner,
      LPAREN: leftParenthesis,
      RPAREN: rightParenthesis,
      SEQNUM: this.MULTIADDON_FILTERS.MADDON_FILTER.length
    });

    return this;
  }

  sortBy(sortBy, sortType = "ASC") {
    this.ADDON_SORT = {
      ALIAS_NAME: sortBy,
      TYPE: sortType
    };

    return this;
  }


}

  

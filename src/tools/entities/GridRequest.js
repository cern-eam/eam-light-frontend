export const GridTypes = Object.freeze({ LIST: "LIST", LOV: "LOV" });

export default class GridRequest {
  constructor(gridName, gridType = GridTypes.LIST, userFunctionName) {
    this.GRID = {
      GRID_NAME: gridName,
      USER_FUNCTION_NAME: userFunctionName,
      NUMBER_OF_ROWS_FIRST_RETURNED: 1000,
      CURSOR_POSITION: 0
    };

    this.GRID_TYPE = {
      TYPE: gridType
    };

    this.REQUEST_TYPE = "LIST.HEAD_DATA.STORED";
    this.LOCALIZE_RESULT = "false"
  }

  setDataspy(dataspyId) {
    this.DATASPY = {
      DATASPY_ID: dataspyId
    };
  }

  addParam(alias, value) {
    if (!this.LOV) {
      this.LOV = {
        LOV_PARAMETERS: {
          LOV_PARAMETER: []
        }
      };
    }

    this.LOV.LOV_PARAMETERS.LOV_PARAMETER.push({
      ALIAS_NAME: alias,
      VALUE: value
    });
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
  }

  sortBy(sortBy, sortType = "ASC") {
    this.ADDON_SORT = {
      ALIAS_NAME: sortBy,
      TYPE: sortType
    };
  }

}

  

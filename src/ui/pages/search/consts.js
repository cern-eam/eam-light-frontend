export const SEARCH_TYPES = {
  PART: {
    text: "Parts",
    value: "PART",
    code: "PART",
  },
  EQUIPMENT_TYPES: {
    text: "Equipment",
    value: "A,P,S,L",
    code: "EQUIPMENT",
  },
  JOB: {
    text: "Work Orders",
    value: "JOB",
    code: "JOB",
  },
};

export const INITIAL_STATE = {
  results: [],
  searchBoxUp: false,
  keyword: "",
  isFetching: false,
  redirectRoute: "",
  selectedItemIndex: -1,
  entityTypes: Object.values(SEARCH_TYPES).map((v) => v.value),
};

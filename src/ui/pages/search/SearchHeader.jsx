import * as React from "react";

import SearchHeaderFilters from "./SearchHeaderFilters";
import SearchHeaderIcon from "./SearchHeaderIcon";
import SearchHeaderInput from "./SearchHeaderInput";

const SEARCH_TYPES = {
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

function FSearchHeader(props) {
  const [searchOn, setSearchOn] = React.useState(
    Object.values(SEARCH_TYPES).map((v) => v.value)
  );

  const searchBoxDiv = React.useRef(null);

  const handleSearchInput = (event, searchOnCurrentValue = searchOn) => {
    props.fetchDataHandler(event.target.value, searchOnCurrentValue.join(","));
  };
  const searchBoxInTheTop = !!props.searchBoxUp;

  return (
    <div
      id="searchBox"
      className={
        props.searchBoxUp
          ? "searchBox searchBoxSearch"
          : "searchBox searchBoxHome"
      }
      ref={(_searchBoxDiv) => (searchBoxDiv.current = _searchBoxDiv)}
      style={
        searchBoxInTheTop
          ? { height: "fit-content", paddingTop: "5px", paddingBottom: "5px" }
          : {}
      }
    >
      <>
        <div id="searchBoxLabel" className="searchBoxLabelHome">
          <SearchHeaderIcon searchBoxUp={props.searchBoxUp} />
        </div>
        <div
          id="searchBoxInput"
          className={
            props.searchBoxUp ? "searchBoxInputSearch" : "searchBoxInputHome"
          }
        >
          <SearchHeaderInput
            searchBoxUp={props.searchBoxUp}
            searchOn={searchOn}
            handleSearchInput={handleSearchInput}
            onKeyDown={props.onKeyDown}
            value={props.keyword}
          />
          <SearchHeaderFilters
            keyword={props.keyword}
            searchOn={searchOn}
            handleSearchInput={handleSearchInput}
            showTypes={props.showTypes}
            setSearchOn={setSearchOn}
          />
        </div>
      </>
    </div>
  );
}

export default FSearchHeader;

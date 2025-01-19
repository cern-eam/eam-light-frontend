import * as React from "react";

import SearchHeaderFilters from "./SearchHeaderFilters";
import SearchHeaderIcon from "./SearchHeaderIcon";
import SearchHeaderInput from "./SearchHeaderInput";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";

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

function SearchHeader({
  fetchDataHandler,
  searchBoxUp,
  keyword,
  onKeyDown,
  isFetching,
  isSuccess,
  showTypes,
}) {
  const [searchOn, setSearchOn] = React.useState(
    Object.values(SEARCH_TYPES).map((v) => v.value)
  );

  const searchBoxDiv = React.useRef(null);
  const entityTypes = searchOn.join(",");
  const handleSearchInput = (event, searchOnCurrentValue = searchOn) => {
    fetchDataHandler(event.target.value, searchOnCurrentValue.join(","));
  };
  const searchBoxInTheTop = !!searchBoxUp;

  return (
    <div
      id="searchBox"
      className={
        searchBoxUp ? "searchBox searchBoxSearch" : "searchBox searchBoxHome"
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
          <SearchHeaderIcon searchBoxUp={searchBoxUp} />
        </div>
        <div
          id="searchBoxInput"
          className={
            searchBoxUp ? "searchBoxInputSearch" : "searchBoxInputHome"
          }
        >
          <SearchHeaderInput
            searchBoxUp={searchBoxUp}
            value={keyword}
            isSuccess={isSuccess}
            isFetching={isFetching}
            handleSearchInput={handleSearchInput}
            onKeyDown={onKeyDown}
          >
            <EAMBarcodeScanner
              onChange={(value) => fetchDataHandler(value, entityTypes)}
            />
          </SearchHeaderInput>
          {showTypes ? (
            <SearchHeaderFilters
              keyword={keyword}
              searchOn={searchOn}
              handleSearchInput={handleSearchInput}
              setSearchOn={setSearchOn}
            />
          ) : null}
        </div>
      </>
    </div>
  );
}

export default SearchHeader;

import * as React from "react";

import SearchHeaderIcon from "./SearchHeaderIcon";
import SearchHeaderInput from "./SearchHeaderInput";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";
import { INITIAL_STATE } from "./useSearchResources";

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
  updateQueryKeys,
  searchBoxUp,
  keyword,
  setKeyword,
  onKeyDown,
  isFetching,
  children,
}) {
  const searchBoxDiv = React.useRef(null);
  const handleSearchInput = (event) => {
    setKeyword(event.target.value);
  };

  return (
    <div
      id="searchBox"
      className={
        searchBoxUp ? "searchBox searchBoxSearch" : "searchBox searchBoxHome"
      }
      ref={(_searchBoxDiv) => (searchBoxDiv.current = _searchBoxDiv)}
      style={
        searchBoxUp
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
            isFetching={isFetching}
            handleSearchInput={handleSearchInput}
            onKeyDown={onKeyDown}
          >
            <EAMBarcodeScanner
              onChange={(value) =>
                updateQueryKeys(value, INITIAL_STATE.entityTypes)
              }
            />
          </SearchHeaderInput>
          {children}
        </div>
      </>
    </div>
  );
}

export default SearchHeader;

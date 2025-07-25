import * as React from "react";

import SearchHeaderIcon from "./SearchHeaderIcon";
import SearchHeaderInput from "./SearchHeaderInput";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";
import { INITIAL_STATE } from "./consts";

function SearchHeader({
  updateQueryKeys,
  searchBoxUp,
  keyword,
  setKeyword,
  onKeyDown,
  isFetching,
  children,
}) {

  return (
    <div
      id="searchBox"
      className={
        searchBoxUp ? "searchBox searchBoxSearch" : "searchBox searchBoxHome"
      }
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
            handleSearchInput={(event) => setKeyword(event.target.value)}
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

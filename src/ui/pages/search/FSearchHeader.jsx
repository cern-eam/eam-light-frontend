import * as React from "react";

import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";
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
  // const [isPhoneScreen, setIsPhoneScreen] = React.useState(false);  - is it used?
  const isPhoneScreen = false; // temporarly

  const searchBoxDiv = React.useRef(null);

  const handleSearchInput = (event) => {
    props.fetchDataHandler(event.target.value, searchOn.join(","));
  };
  const searchBoxInTheTop = !!(props.searchBoxUp && isPhoneScreen);

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
      {searchBoxInTheTop ? (
        <div
          id="searchBoxInput"
          className="searchBoxInputSearch"
          style={{ width: "100%" }}
        >
          <SearchHeaderInput
            searchBoxUp={props.searchBoxUp}
            searchOn={searchOn}
            handleSearchInput={handleSearchInput}
            onKeyDown={props.onKeyDown}
            value={props.keyword}
          />
          <div
            id="searchBoxLabel"
            className="searchBoxLabelHome"
            style={{ justifyContent: "left" }}
          >
            <SearchHeaderIcon searchBoxUp={props.searchBoxUp} />
            <SearchHeaderFilters
              isPhoneScreen={isPhoneScreen}
              setSearchOn={setSearchOn}
              searchOn={searchOn}
              keyword={props.keyword}
              showTypes={props.showTypes}
              handleSearchInput={handleSearchInput}
            />
          </div>
        </div>
      ) : (
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
              isPhoneScreen={isPhoneScreen}
              keyword={props.keyword}
              searchOn={searchOn}
              handleSearchInput={handleSearchInput}
              showTypes={props.showTypes}
              setSearchOn={setSearchOn}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default FSearchHeader;

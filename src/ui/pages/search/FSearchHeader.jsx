import * as React from "react";
import FontIcon from "@mui/material/Icon";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
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

const SearchHeaderIcon = (props) => {
  return (
    <>
      <img
        src="images/eamlight_logo.png"
        alt="EAM Light Logo"
        style={{ paddingLeft: 20, paddingRight: 10 }}
      />
      <div
        id="searchBoxLabelGreeting"
        className={
          props.searchBoxUp
            ? "searchBoxLabelGreetingSearch"
            : "searchBoxLabelGreetingHome"
        }
      >
        <span
          className="FontLatoBlack Fleft Fs30 DispBlock"
          style={{ color: "#02a2f2" }}
        >
          Welcome to EAM Light
        </span>
      </div>
    </>
  );
};

const SearchHeaderInput = ({
  searchOn = "",
  handleSearchInput,
  onKeyDown,
  keyword,
  fetchDataHandler,
}) => {
  const entityTypes = searchOn.join(",");
  const searchInput = React.useRef(null);
  React.useEffect(() => {
    searchInput.current.focus();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        onChange={handleSearchInput}
        id="searchInputText"
        onKeyDown={onKeyDown}
        value={keyword}
        style={{ textTransform: "uppercase" }}
        ref={(input) => {
          searchInput.current = input;
        }}
      />
      <EAMBarcodeScanner
        onChange={(value) => fetchDataHandler(value, entityTypes)}
      />
    </div>
  );
};

const SearchHeaderFilters = ({
  showTypes,
  searchOn = "",
  setSearchOn,
  handleSearchInput,
  keyword,
  isPhoneScreen,
}) => {
  return (
    <>
      {showTypes ? (
        <div
          className="searchTypes"
          style={
            isPhoneScreen ? { flexDirection: "column", height: "auto" } : {}
          }
        >
          {Object.values(SEARCH_TYPES).map((searchType) => (
            <EAMCheckbox
              key={searchType.code}
              label={searchType.text}
              value={searchOn.includes(searchType.value).toString()}
              rootStyle={{ flex: "0 1 auto" }}
              onChange={() => {
                setSearchOn((prevSearchOn) => {
                  return prevSearchOn.includes(searchType.value)
                    ? prevSearchOn.filter((val) => val !== searchType.value)
                    : [...prevSearchOn, searchType.value];
                });
                handleSearchInput({
                  target: { value: keyword },
                });
              }}
            />
          ))}
        </div>
      ) : null}
      <label id="searchPlaceHolder">
        {!keyword && "Search for Equipment, Work Orders, Parts, ..."}
      </label>
    </>
  );
};

export function FSearchHeader(props) {
  const [searchOn, setSearchOn] = React.useState(
    Object.values(SEARCH_TYPES).map((v) => v.value)
  );
  const [isPhoneScreen, setIsPhoneScreen] = React.useState(false);
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

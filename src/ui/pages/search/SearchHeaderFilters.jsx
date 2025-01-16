import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";

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
        {!keyword ? "Search for Equipment, Work Orders, Parts, ..." : null}
      </label>
    </>
  );
};

export default SearchHeaderFilters;

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

const SearchHeaderFilters = ({ entityTypes, setEntityTypes }) => {
  const searchOn = entityTypes.join(",");
  return (
    <div className="searchTypes">
      {Object.values(SEARCH_TYPES).map((searchType) => (
        <EAMCheckbox
          key={searchType.code}
          label={searchType.text}
          value={searchOn.includes(searchType.value).toString()}
          rootStyle={{ flex: "0 1 auto" }}
          onChange={() => {
            setEntityTypes((prevSearchOn) => {
              const newState = prevSearchOn.includes(searchType.value)
                ? prevSearchOn.filter((val) => val !== searchType.value)
                : [...prevSearchOn, searchType.value];

              return newState;
            });
          }}
        />
      ))}
    </div>
  );
};

export default SearchHeaderFilters;

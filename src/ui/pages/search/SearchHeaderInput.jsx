import * as React from "react";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";

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

export default SearchHeaderInput;

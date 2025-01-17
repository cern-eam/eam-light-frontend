import React, { useEffect, useRef } from "react";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";

const SearchHeaderInput = ({
  searchOn = "",
  handleSearchInput,
  onKeyDown,
  value,
  fetchDataHandler,
}) => {
  const entityTypes = searchOn.join(",");
  const searchInput = useRef(null);

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        onChange={handleSearchInput}
        id="searchInputText"
        onKeyDown={onKeyDown}
        placeholder="Search for Equipment, Work Orders, Parts, ..."
        value={value}
        class="searchInputText"
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

import * as React from "react";
import SearchResult from "./SearchResult";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
/**
 * Function Version of the component
 */
function FSearchResults(props) {
  const mapItemToSearchResult = (item, number) => {
    const isSelected = item.code === props.selectedItemCode;

    return (
      <TableRow
        key={number}
        selected={isSelected}
        style={isSelected ? { backgroundColor: "#def4fa" } : {}}
      >
        <SearchResult
          data={item}
          keyword={props.keyword}
          selected={isSelected}
        />
      </TableRow>
    );
  };

  return (
    <div style={{ fontSize: "16px" }}>
      <Table>
        <TableBody>{props.data.map(mapItemToSearchResult)}</TableBody>
      </Table>
    </div>
  );
}

export default FSearchResults;

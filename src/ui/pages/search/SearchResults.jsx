import * as React from "react";
import SearchResult from "./SearchResult";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import FSearchResults from "./FSearchResults";

export default FSearchResults;
class SearchResults extends React.Component {
  render() {
    return (
      <div style={{ fontSize: "16px" }}>
        <Table>
          <TableBody>
            {this.props.data.map(this.mapItemToSearchResult.bind(this))}
          </TableBody>
        </Table>
      </div>
    );
  }

  mapItemToSearchResult(item, number) {
    let isSelected = item.code === this.props.selectedItemCode;

    return (
      <TableRow
        key={number}
        selected={isSelected}
        style={isSelected ? { backgroundColor: "green" } : {}}
      >
        <SearchResult
          data={item}
          keyword={this.props.keyword}
          selected={isSelected}
        />
      </TableRow>
    );
  }
}

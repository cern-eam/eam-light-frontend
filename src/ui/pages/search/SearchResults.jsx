import * as React from "react";
import SearchResult, {FSearchResult} from "./SearchResult";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

export default class SearchResults extends React.Component {
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

/**
 * Function Version of the component
 */
export function FSearchResults(props) {
  const mapItemToSearchResult = (item, number) => {
    const isSelected = item.code === props.selectedItemCode;

    return (
      <TableRow
        key={number}
        selected={isSelected}
        style={isSelected ? { backgroundColor: "#def4fa" } : {}}
      >
        <FSearchResult
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

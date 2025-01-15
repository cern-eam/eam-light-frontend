import * as React from "react";
import TableCell from "@mui/material/TableCell";
import SearchHighlighter, { FSearchHighlighter } from "./SearchHighlighter";
import EntityCode from "../../../enums/EntityCode";

export default class SearchResult extends React.Component {
  getSearchItemLabel(code) {
    switch (code) {
      case EntityCode.ASSET: {
        return "Asset:";
      }
      case EntityCode.POSITION: {
        return "Position:";
      }
      case EntityCode.SYSTEM: {
        return "System:";
      }
      case EntityCode.WORKORDER: {
        return "Work Order:";
      }
      case EntityCode.PART: {
        return "Part:";
      }
      case EntityCode.LOCATION: {
        return "Location: ";
      }
      default: {
        return "Equipment:";
      }
    }
  }

  render() {
    return (
      <TableCell>
        <table
          className={
            this.props.selected
              ? "searchResultTableCell selectedRow"
              : "searchResultTableCell"
          }
        >
          <tbody className="searchResultRowCell">
            <tr>
              <td>{this.getSearchItemLabel(this.props.data.type)}</td>
              <td>
                <SearchHighlighter
                  style={{ color: "#1a0dab", fontWeight: "bold" }}
                  data={this.props.data.code}
                  keyword={this.props.keyword}
                  link={this.props.data.link}
                  type={this.props.data.type}
                />
              </td>
            </tr>
            {this.props.data.serial && (
              <tr>
                <td>Serial number:</td>
                <SearchHighlighter
                  data={this.props.data.serial}
                  keyword={this.props.keyword}
                />
              </tr>
            )}
            {this.props.data.alias && (
              <tr>
                <td>Alias:</td>
                <SearchHighlighter
                  data={this.props.data.alias}
                  keyword={this.props.keyword}
                />
              </tr>
            )}
            <tr>
              <td>Description:</td>
              <td>{this.props.data.description}</td>
            </tr>
            <tr>
              <td>Department:</td>
              <td>{this.props.data.mrc}</td>
            </tr>
          </tbody>
        </table>
      </TableCell>
    );
  }
}

const getSearchItemLabel = (code) => {
  switch (code) {
    case EntityCode.ASSET: {
      return "Asset:";
    }
    case EntityCode.POSITION: {
      return "Position:";
    }
    case EntityCode.SYSTEM: {
      return "System:";
    }
    case EntityCode.WORKORDER: {
      return "Work Order:";
    }
    case EntityCode.PART: {
      return "Part:";
    }
    case EntityCode.LOCATION: {
      return "Location: ";
    }
    default: {
      return "Equipment:";
    }
  }
};

export function FSearchResult({ selected, data, keyword }) {
  return (
    <TableCell>
      <table
        className={
          selected
            ? "searchResultTableCell selectedRow"
            : "searchResultTableCell"
        }
      >
        <tbody className="searchResultRowCell">
          <tr>
            <td>{getSearchItemLabel(data.type)}</td>
            <td>
              <FSearchHighlighter
                style={{ color: "#1a0dab", fontWeight: "bold" }}
                data={data.code}
                keyword={keyword}
                link={data.link}
                type={data.type}
              />
            </td>
          </tr>
          {data.serial ? (
            <tr>
              <td>Serial number:</td>
              <FSearchHighlighter data={data.serial} keyword={keyword} />
            </tr>
          ) : null}
          {data.alias ? (
            <tr>
              <td>Alias:</td>
              <FSearchHighlighter data={data.alias} keyword={keyword} />
            </tr>
          ) : null}
          <tr>
            <td>Description:</td>
            <td>{data.description}</td>
          </tr>
          <tr>
            <td>Department:</td>
            <td>{data.mrc}</td>
          </tr>
        </tbody>
      </table>
    </TableCell>
  );
}

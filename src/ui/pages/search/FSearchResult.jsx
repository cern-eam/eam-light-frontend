import * as React from "react";
import TableCell from "@mui/material/TableCell";
import SearchHighlighter from "./SearchHighlighter";
import EntityCode from "../../../enums/EntityCode";

function FSearchResult({ selected, data, keyword }) {
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
              <SearchHighlighter
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
              <SearchHighlighter data={data.serial} keyword={keyword} />
            </tr>
          ) : null}
          {data.alias ? (
            <tr>
              <td>Alias:</td>
              <SearchHighlighter data={data.alias} keyword={keyword} />
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

export default FSearchResult;

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

import * as React from "react";
import TableCell from "@mui/material/TableCell";
import SearchHighlighter from "./SearchHighlighter";
import EntityCode from "@/enums/EntityCode";

function SearchResult({ selected, data, keyword }) {
  const searchItemLabel = entityLabels[data.type] ?? FALLBACK_ENTITY_LABEL;

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
            <td>{searchItemLabel}</td>
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

export default SearchResult;

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

const entityLabels = {
  [EntityCode.ASSET]: "Asset:",
  [EntityCode.POSITION]: "Position:",
  [EntityCode.SYSTEM]: "System:",
  [EntityCode.WORKORDER]: "Work Order:",
  [EntityCode.PART]: "Part:",
  [EntityCode.LOCATION]: "Location:",
};

const FALLBACK_ENTITY_LABEL = "Equipment";

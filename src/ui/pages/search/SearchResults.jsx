import * as React from "react";

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";

function SearchResults({ data, renderResult, selectedItemCode }) {
  return (
    <Table style={{ fontSize: "16px" }}>
      <TableBody>
        {data.map((item) => {
          const isSelected = item.code === selectedItemCode;
          return (
            <TableRow
              key={item.code}
              selected={isSelected}
              style={isSelected ? { backgroundColor: "#def4fa" } : {}}
            >
              {renderResult({ item, isSelected })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default SearchResults;

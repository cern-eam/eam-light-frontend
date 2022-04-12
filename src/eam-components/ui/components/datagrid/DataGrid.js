import React from "react";
import { DataGridProvider } from "./DataGridContext";

const DataGrid = props => (
    <DataGridProvider {...props}>{props.children}</DataGridProvider>
);

export default DataGrid;

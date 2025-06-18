import * as React from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import SyncedQueryParamsEAMGridContext from "../../../tools/SyncedQueryParamsEAMGridContext";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import useUserDataStore from "../../../state/useUserDataStore";
import InfoPage from "../../components/infopage/InfoPage";

const treatParamAsList = (param) =>
  param === undefined || param === null
    ? []
    : Array.isArray(param)
    ? param
    : param.includes(",")
    ? param.split(",")
    : [param];

const cellRenderer =
  (userColumns) =>
  ({ column, value }) => {
    const userColumnToType = {
      equipmentColumns: "equipment",
      locationColumns: "location",
      workorderColumns: "workorder",
      partColumns: "part",
    };

    const typeToDefaultColumns = {
      equipment: ["equipmentno", "obj_code", "evt_object", "equipment"],
      location: ["location"],
      workorder: ["workordernum", "evt_code", "parentwo"],
      part: ["part"],
    };

    const link =
      userColumnToType[
        Object.keys(userColumnToType).find((userColumn) =>
          treatParamAsList(userColumns[userColumn]).includes(column.id)
        )
      ] ||
      Object.keys(typeToDefaultColumns).find((type) =>
        typeToDefaultColumns[type].includes(column.id)
      );

    return link === undefined
      ? EAMCellField({ column, value })
      : getLink(`/${link}/`, value);
  };

const getLink = (path, val) => (
  <Typography>
    <Link to={path + encodeURIComponent(val)}>{val}</Link>
  </Typography>
);

const Grid = () => {
  const values = queryString.parse(window.location.search);
  const { userData } = useUserDataStore();
  const screen = userData.reports["Lists & Reports"].find(
    (screen) => screen.screencode === values.gridName
  );

  if (!values?.gridName || !screen) {
    const baseMessage = !values?.gridName ? "No grid name was provided." : "Could not find grid.";
    
    return (
      <InfoPage
        title="Error: Grid Fetching Failed"
        message={`${baseMessage} If you clicked a link, it might be broken.`}
        includeSupportButton
      />
    );
  }

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={values.gridName}
      cellRenderer={cellRenderer(values)}
      searchOnMount={screen?.startupmode_display !== "Pas d'action"}
      key={values.gridName}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default Grid;

import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../../state/useUserDataStore";

const cellRenderer = ({ column, value, row }) => {
  if (column.id === "equipmentno") {
    return (
      <Typography>
        <Link
          to={
            "/asset/" +
            value +
            (row.values.organization ? "%23" + row.values.organization : "")
          }
        >
          {value}
        </Link>
      </Typography>
    );
  }
  return EAMCellField({ column, value });
};

const AssetSearch = (props) => {
  const { handleError } = props;
  const { userData } = useUserDataStore();
  const assetScreen = userData.screens[userData.assetScreen]

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={assetScreen.screenCode}
      handleError={handleError}
      searchOnMount={assetScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      key={assetScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default AssetSearch;

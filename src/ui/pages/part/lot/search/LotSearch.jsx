import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../../state/useUserDataStore";
import useSnackbarStore from "../../../../../state/useSnackbarStore";

const cellRenderer = ({ column, value, row }) => {
  if (column.id === "lotcode") {
    return (
      <Typography>
        <Link
          to={
            "/lot/" +
            value +
            (row.original.organization ? "%23" + row.original.organization : "")
          }
        >
          {value}
        </Link>
      </Typography>
    );
  }
  return EAMCellField({ column, value });
};

const LotSearch = (props) => {
  const { handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const lotScreen = userData.screens[userData.lotScreen];

  if (!lotScreen) {
    return null;
  }

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={lotScreen.screenCode}
      searchOnMount={lotScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      handleError={handleError}
      key={lotScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default LotSearch;

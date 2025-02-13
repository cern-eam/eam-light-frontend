import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../../state/useUserDataStore";
import useSnackbarStore from "../../../../../state/useSnackbarStore";

const cellRenderer = ({ column, value, row }) => {
  if (column.id === "equipmentno") {
    return (
      <Typography>
        <Link
          to={
            "/position/" +
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

const PositionSearch = (props) => {
  const { handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const positionScreen = userData.screens[userData.positionScreen];

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={positionScreen.screenCode}
      handleError={handleError}
      searchOnMount={positionScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      key={positionScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default PositionSearch;

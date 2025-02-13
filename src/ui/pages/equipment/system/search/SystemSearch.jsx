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
            "/system/" +
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

const SystemSearch = (props) => {
  const { handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const systemScreen = userData.screens[userData.systemScreen];

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={systemScreen.screenCode}
      handleError={handleError}
      searchOnMount={systemScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      keyName={systemScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default SystemSearch;

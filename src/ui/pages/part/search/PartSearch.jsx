import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../state/useUserDataStore";
import useSnackbarStore from "../../../../state/useSnackbarStore";

const cellRenderer = ({ column, value, row }) => {
  if (column.id === "partcode") {
    return (
      <Typography>
        <Link
          to={
            "/part/" +
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

const PartSearch = (props) => {
  const { handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const partScreen = userData.screens[userData.partScreen]

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={partScreen.screenCode}
      searchOnMount={partScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      handleError={handleError}
      key={partScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default PartSearch;

import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import SyncedQueryParamsEAMGridContext from "../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../state/useUserDataStore";

const cellRenderer = ({ column, value }) => {
  if (column.id === "workordernum") {
    return (
      <Typography>
        <Link to={"/workorder/" + value}>{value}</Link>
      </Typography>
    );
  }

  return EAMCellField({ column, value });
};

const WorkorderSearch = (props) => {
  const { handleError } = props;
  const { userData } = useUserDataStore();
  const workOrderScreen = userData.screens[userData.workOrderScreen];

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={workOrderScreen.screenCode}
      handleError={handleError}
      searchOnMount={workOrderScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      key={workOrderScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default WorkorderSearch;

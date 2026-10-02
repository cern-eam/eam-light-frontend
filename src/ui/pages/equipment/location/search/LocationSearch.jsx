import * as React from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../../state/useUserDataStore";
import useSnackbarStore from "../../../../../state/useSnackbarStore";
import useInforContextStore from "../../../../../state/useInforContext";
import { isCernMode } from "eam-components/dist/tools/CERNMode";


const cellRenderer = ({ column, value }) => {
  if (column.id === "equipmentno") {
    const { inforContext } = useInforContextStore.getState();
    const suffix = !isCernMode ? encodeURIComponent(`#${inforContext.INFOR_ORGANIZATION}`) : "";

    return (
      <Typography>
        <Link to={`/location/${value}${suffix}`}>{value}</Link>
      </Typography>
    );
  }
  return EAMCellField({ column, value });
};

const LocationSearch = (props) => {
  const { handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const locationScreen= userData.screens[userData.locationScreen]
            
  return (
    <SyncedQueryParamsEAMGridContext
      gridName={locationScreen.screenCode}
      handleError={handleError}
      searchOnMount={locationScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      key={locationScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default LocationSearch;

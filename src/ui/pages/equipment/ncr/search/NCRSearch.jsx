import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import SyncedQueryParamsEAMGridContext from "../../../../../tools/SyncedQueryParamsEAMGridContext";
import useUserDataStore from "../../../../../state/userDataStore";

const cellRenderer = ({ column, value, row }) => {
  if (column.id === "nonconformity") {
    return (
      <Typography>
        <Link
          to={
            "/ncr/" +
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

const NCRSearch = (props) => {
  const { handleError } = props;
  const { userData } = useUserDataStore();
  const ncrScreen = userData.screens[userData.ncrScreen];

  return (
    <SyncedQueryParamsEAMGridContext
      gridName={ncrScreen.screenCode}
      handleError={handleError}
      searchOnMount={ncrScreen.startupAction !== "N"}
      cellRenderer={cellRenderer}
      key={ncrScreen.screenCode}
    >
      <EAMGrid />
    </SyncedQueryParamsEAMGridContext>
  );
};

export default NCRSearch;

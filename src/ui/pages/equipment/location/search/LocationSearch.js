import React from "react";
import EAMGrid from "eam-components/dist/ui/components/eamgrid";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const cellRenderer = cell =>
    cell.t === "equipmentno" ? (
        <Typography>
            <Link to={"/location/" + cell.value}>{cell.value}</Link>
        </Typography>
    ) : null;

const LocationSearch = props => {
    const { locationScreen, handleError } = props;
    return (
        <div className="entityContainer">
            <EAMGrid
                gridId={locationScreen.gridId}
                screenCode={locationScreen.screenCode}
                handleError={handleError}
                cellRenderer={cellRenderer}
                searchOnMount={locationScreen.startupAction !== "N"}
            />
        </div>
    );
};

export default LocationSearch;

import React from 'react';
import queryString from "query-string";
import EAMGrid from "eam-components/dist/ui/components/eamgrid";

function Grid(props) {
    const values = queryString.parse(window.location.search);

    return (
        <div className="entityContainer">
            <EAMGrid
                screenCode={values.gridName}
            />
        </div>
    )
}

export default Grid;
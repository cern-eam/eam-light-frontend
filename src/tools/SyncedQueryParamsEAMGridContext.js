import React from 'react'
import { useHistory } from "react-router";
import GridTools from "./GridTools";
import { EAMGridContextProvider } from "eam-components/dist/ui/components/grids/eam/EAMGridContext";

const SyncedQueryParamsEAMGridContext = (props) => {
    const { children, ...otherProps } = props;
    const history = useHistory();
    const filters = GridTools.parseGridFilters(GridTools.getURLParameterByName('gridFilters'));
    const initialDataspyID = GridTools.getURLParameterByName('gridDataspyID');
    return (
        <EAMGridContextProvider
            initialFilters={filters}
            onChangeFilters={(newFilters) => {
                const params = GridTools.replaceUrlParam('gridFilters', GridTools.stringifyGridFilters(newFilters));
                history.push(params);
            }}
            initialDataspyID={initialDataspyID}
            onChangeDataspy={(newDataspy) => {
                const params = GridTools.replaceUrlParam('gridDataspyID', newDataspy.code);
                history.push(params);
            }}
            {...otherProps}
        >
            {children}
        </EAMGridContextProvider>
    );
}

export default SyncedQueryParamsEAMGridContext

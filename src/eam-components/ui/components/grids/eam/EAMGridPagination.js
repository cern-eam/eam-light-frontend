import { TablePagination } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import React from "react";

const defaultOptions = [50, 100, 250, 500, 1000];

const getCount = (hasUnknownCount, count) => hasUnknownCount ? `${count}+` : count;

const CustomTablePagination = withStyles(() => ({
    toolbar: { padding: 0 }
}))(TablePagination);

const EAMGridPagination = ({
    pageIndex,
    rowsPerPage,
    totalRecords,
    hasUnkownTotalRecords,
    onChangePage,
    onChangeRowsPerPage,
    rowsPerPageOptionsComputed,
    labelRowsPerPage,
    rowsPerPageOptions = rowsPerPageOptionsComputed ? rowsPerPageOptionsComputed(defaultOptions) : defaultOptions,
}) => {
    const handleChangePage = (event, newPage) => {
        event.stopPropagation();
        onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        event.stopPropagation();
        onChangeRowsPerPage(Number(event.target.value));
    };

    const label = ({ from, to, count }) =>
        `${from}-${to} of ${getCount(hasUnkownTotalRecords, count)}`;

    return (
        <CustomTablePagination
            component="div"
            page={pageIndex}
            count={totalRecords}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage={labelRowsPerPage}
            labelDisplayedRows={label}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    );
};

export default EAMGridPagination;

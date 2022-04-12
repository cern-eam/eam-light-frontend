import React, { useContext } from "react"
import EAMGridMain from "./EAMGridMain";
import EAMGridPagination from "./EAMGridPagination";
import EAMGridFooter from "./EAMGridFooter";
import EAMGridHead from "./EAMGridHead";
import { EAMGridContext } from "./EAMGridContext";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import EAMGridKeyboardHandler from "./EAMGridKeyboardHandler";
import { Box, Button } from "@mui/material";


const EAMGrid = (props) => {
    const {
        getRowProps,
        getCellProps,
        rowsPerPageOptionsComputed,
        customFooterOptions,
    } = props;
    const {
        dataspies,
        selectedDataspy,
        disableFilters,
        pageIndex,
        rowsPerPage,
        toggleFilters,
        handleOnSearch,
        handleChangePage,
        handleChangeRowsPerPage,
        handleDataspyChange,
        handleResetFilters,
        handleExportToCSV,
        hasUnkownTotalRecords,
        totalRecords,
        tableInstance,
        loading,
        loadingExportToCSV,
    } = useContext(EAMGridContext);

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "white" }}>
            <EAMGridKeyboardHandler
                tableInstance={tableInstance}
                onSearch={handleOnSearch}
                toggleFilters={toggleFilters}
            />
            <EAMGridHead
                selectedDataspy={selectedDataspy}
                dataspies={dataspies}
                onSearch={handleOnSearch}
                disableFilters={disableFilters}
                toggleFilters={toggleFilters}
                onDataspyChange={handleDataspyChange}
                onResetFilters={handleResetFilters}
            />
            <BlockUi tag="div" blocking={loading} style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EAMGridMain
                    loading={loading}
                    tableInstance={tableInstance}
                    getRowProps={getRowProps}
                    getCellProps={getCellProps}
                />
            </BlockUi>
            <EAMGridFooter>
                <Box flex="1" display="flex">
                    {customFooterOptions ? (
                        customFooterOptions()
                    ) : (
                        <BlockUi
                            tag="div"
                            blocking={loadingExportToCSV}
                            style={{ minHeight: "auto" }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleExportToCSV}
                            >
                                Export to CSV
                            </Button>
                        </BlockUi>
                    )}
                </Box>
                <EAMGridPagination
                    labelRowsPerPage={"Per Page"}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    pageIndex={pageIndex}
                    rowsPerPage={rowsPerPage}
                    hasUnkownTotalRecords={hasUnkownTotalRecords}
                    totalRecords={totalRecords}
                    rowsPerPageOptionsComputed={rowsPerPageOptionsComputed}
                />
            </EAMGridFooter>
        </div>
    )
}

export default EAMGrid

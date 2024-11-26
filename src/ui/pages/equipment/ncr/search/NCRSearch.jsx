import useUserDataStore from "@/state/useUserDataStore";
import SyncedQueryParamsEAMGridContext from "@/tools/SyncedQueryParamsEAMGridContext";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import EAMGrid from "eam-components/dist/ui/components/grids/eam/EAMGrid";
import { EAMCellField } from "eam-components/dist/ui/components/grids/eam/utils";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import useSnackbarStore from "../../../../../state/useSnackbarStore";

const COLORS = {
    red: {
        color: "#bf360C",
        backgroundColor: "rgba(251,233,231,0.7)",
    },
    green: {
        color: "#388e3c",
        backgroundColor: "rgba(200, 255, 200, 0.7)",
    },
    orange: {
        color: "#FF7F2B",
        backgroundColor: "rgba(255,183,42,0.13)",
    },
    blue: {
        color: "#1976d2",
        backgroundColor: "rgba(227,242,253,0.5)",
    },
    yellow: {
        color: "#5c4d3f",
        backgroundColor: "rgba(255, 255, 204, 0.9)",
    },
    pink: {
        color: "#8f3319",
        backgroundColor: "rgba(252, 204, 239, 0.5)",
    },
    grey: {
        color: "#a3a3a3",
        backgroundColor: "rgba(240, 240, 240, 0.9)",
    },
};

const STATUS_COLOR_MAP = {
    Open: COLORS.red,
    Closed: COLORS.green,
    "In Progress": COLORS.orange,
    Cancelled: COLORS.grey,
};

const getColorFromStatus = (status) => {
    return STATUS_COLOR_MAP[status] ?? COLORS.yellow;
};

const centerTextStyle = {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
};

const LinkTo = ({ to, value }) => (
    <Typography style={centerTextStyle}>
        <Link
            to={to}
            onClick={(event) => {
                event.stopPropagation();
            }}
        >
            {value}
        </Link>
    </Typography>
);

const cellRenderer = ({ column, value, row }) => {
    if (column.id === "nonconformity") {
        return (
            <LinkTo
                to={
                    "/ncr/" +
                    value +
                    (row.values.organization
                        ? "%23" + row.values.organization
                        : "")
                }
                value={value}
            />
        );
    }
    if (column.id === "equipment") {
        return <LinkTo to={"/equipment/" + value} value={value} />;
    }

    return EAMCellField({ column, value });
};

const useStyles = makeStyles((theme) => ({
    rowStyler: {
        cursor: "pointer",
        minHeight: "44px",
        maxHeight: "132px",
        "&:hover": {
            boxShadow: `0 4px 8px rgba(0, 0, 0, 0.3)`,
            boxSizing: "border-box !important",
            borderLeft: `6px solid ${theme.palette.primary.main}`,
        },
        "&:hover::before": {
            // content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "6px",
            backgroundColor: theme.palette.primary.main,
        },
    },
    icon: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}));

const NCRSearch = (props) => {
    const { handleError } = useSnackbarStore();
    const { userData } = useUserDataStore();
    const ncrScreen = userData.screens[userData.ncrScreen];

    const classes = useStyles();
    const history = useHistory();

    const rowStyler = useCallback(
        ({ values }) => {
            return {
                style: getColorFromStatus(values.status_display),
                className: classes?.rowStyler,
                onClick: () => {
                    const url =
                        "/ncr/" +
                        values.nonconformity +
                        (values.organization
                            ? "%23" + values.organization
                            : "");
                    history.push(url);
                },
            };
        },
        [classes, history]
    );

    return (
        <SyncedQueryParamsEAMGridContext
            gridName={ncrScreen.screenCode}
            handleError={handleError}
            searchOnMount={ncrScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
            key={ncrScreen.screenCode}
        >
            <EAMGrid getRowProps={rowStyler} />
        </SyncedQueryParamsEAMGridContext>
    );
};

export default NCRSearch;

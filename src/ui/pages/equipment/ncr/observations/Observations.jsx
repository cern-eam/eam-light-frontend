import { useState, useEffect } from "react";
import WSNCRs from "../../../../../tools/WSNCRs";
import EISTable from "eam-components/dist/ui/components/table";
import BlockUi from "react-block-ui";
import Button from "@mui/material/Button";
import ObservationsDialog from "./ObservationsDialog";

const Observations = (props) => {
    const headers = [
        "Observation",
        "Severity",
        "Condition Score",
        "Condition Index",
        "Recorded By",
        "Date Recorded",
    ];
    const propCodes = [
        "observation",
        "severity_display",
        "conditionscore",
        "conditionindex_display",
        "recordedby",
        "daterecorded",
    ];

    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState([]);

    useEffect(() => fetchData(props.ncr.code), [props.ncr.code]);

    const adjustData = (data) => {
        return data.map((observation) => ({
            ...observation,
        }));
    };

    const fetchData = (ncr) => {
        setIsLoading(true);
        if (ncr) {
            WSNCRs.getNonConformityObservations(ncr)
                .then((response) => {
                    const data = adjustData(response.body.data);
                    setData(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                });
        }
    };

    const successHandler = () => {
        props.showNotification("Observation created successfully");
        setIsDialogOpen(false);
        fetchData(props.ncr.code);
    };

    return isLoading ? (
        <BlockUi tag="div" blocking={isLoading} style={{ width: "100%" }} />
    ) : (
        <>
            <div style={{ width: "100%", height: "100%" }}>
                {data?.length > 0 && (
                    <EISTable
                        data={data}
                        headers={headers}
                        propCodes={propCodes}
                    />
                )}
                <div style={{ height: 15 }} />
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    color="primary"
                    disabled={props.disabled}
                    variant="outlined"
                >
                    Add Observation
                </Button>
            </div>
            <ObservationsDialog
                handleError={props.handleError}
                handleCancel={() => setIsDialogOpen(false)}
                tabLayout={props.tabLayout.fields}
                isDialogOpen={isDialogOpen}
                ncr={props.ncr}
                isLoading={isLoading}
                successHandler={successHandler}
            />
        </>
    );
};

export default Observations;

import { useState, useEffect, useCallback, useMemo } from "react";
import WSNCRs from "../../../../../tools/WSNCRs";
import EISTable from "eam-components/dist/ui/components/table";
import BlockUi from "react-block-ui";
import Button from "@mui/material/Button";
import ObservationsDialog from "./ObservationsDialog";
import useLayoutStore from "../../../../../state/useLayoutStore";
import WorkOrdersDialog from "./WorkOrdersDialog";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import useUserDataStore from "../../../../../state/useUserDataStore";

const Observations = ({
    ncr,
    showNotification,
    disabled,
    handleError,
    observationFields,
    statuses,
}) => {
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

    const {userData} = useUserDataStore();
    const [data, setData] = useState([]);
    const [isObservationsDialogOpen, setIsObservationsDialogOpen] =
        useState(false);
    const [isWorkOrdersDialogOpen, setIsWorkOrdersDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState([]);

    const {
        screenLayout: {
            OSJOBS: { fields: workOrderFields },
        },
    } = useLayoutStore();

    const ncrCode = useMemo(() => ncr.code, [ncr.code]);

    const fetchData = useCallback(async (ncr) => {
        if (ncr) {
            try {
                setIsLoading(true);
                const response = await WSNCRs.getNonConformityObservations(ncr);
                setData(response.body.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => fetchData(ncrCode), [ncrCode, fetchData]);

    const observationsDialogSuccessHandler = useCallback(
        async (observation) => {
            try {
                await WSNCRs.createObservation({
                    ...observation,
                    nonConformityCode: ncrCode,
                });
                showNotification("Observation created successfully");
                setIsObservationsDialogOpen(false);
                fetchData(ncrCode);
            } catch (error) {
                handleError(error);
            }
        },
        [fetchData, ncrCode]
    );

    const workOrdersDialogSuccessHandler = useCallback(
        async (workOrder) => {
            try {
                const response = await WSWorkorders.createWorkOrder(workOrder);
                showNotification("Work order created successfully");
                await observationsDialogSuccessHandler({
                    jobNum: response.body.data,
                    nonConformityCode: ncrCode,
                });
                setIsWorkOrdersDialogOpen(false);
            } catch (error) {
                handleError(error);
            }
        },
        [observationsDialogSuccessHandler, ncrCode]
    );

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
                <div style={{ display: "flex", columnGap: 10 }}>
                    <Button
                        onClick={() => setIsObservationsDialogOpen(true)}
                        color="primary"
                        disabled={disabled}
                        variant="outlined"
                    >
                        Add Observation
                    </Button>
                    <Button
                        onClick={() => setIsWorkOrdersDialogOpen(true)}
                        color="primary"
                        disabled={disabled}
                        variant="outlined"
                    >
                        Create WO
                    </Button>
                </div>
            </div>
            <ObservationsDialog
                handleCancel={() => setIsObservationsDialogOpen(false)}
                tabLayout={observationFields}
                isDialogOpen={isObservationsDialogOpen}
                ncr={ncr}
                isLoading={isLoading}
                successHandler={observationsDialogSuccessHandler}
            />
            <WorkOrdersDialog
                handleCancel={() => setIsWorkOrdersDialogOpen(false)}
                fields={workOrderFields}
                isDialogOpen={isWorkOrdersDialogOpen}
                isLoading={isLoading}
                successHandler={workOrdersDialogSuccessHandler}
                userData={userData}
                statuses={statuses}
            />
        </>
    );
};

export default Observations;

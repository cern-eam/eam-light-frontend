import { useState, useEffect, useCallback, useMemo } from "react";
import WSNCRs from "../../../../../tools/WSNCRs";
import EISTable from "eam-components/dist/ui/components/table";
import BlockUi from "react-block-ui";
import Button from "@mui/material/Button";
import ObservationsDialog from "./ObservationsDialog";
import useLayoutStore from "../../../../../state/layoutStore";
import WorkOrdersDialog from "./WorkOrdersDialog";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import useUserDataStore from "../../../../../state/userDataStore";
import useObservationsDialog from "./hooks/useObservationsDialog";

const Observations = ({
    ncrCode,
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

    const { userData } = useUserDataStore();
    const [observations, setObservations] = useState([]);
    const [isWorkOrdersDialogOpen, setIsWorkOrdersDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState([]);

    const {
        screenLayout: {
            OSJOBS: { fields: workOrderFields },
        },
    } = useLayoutStore();

    const fetchData = useCallback(async (ncr) => {
        if (ncr) {
            try {
                setIsLoading(true);
                const response = await WSNCRs.getNonConformityObservations(ncr);
                setObservations(response.body.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    const {
        isOpen: isObservationsDialogOpen,
        isDisabled: isObservationsDialogDisabled,
        observation,
        updateHandler: observationsDialogUpdateHandler,
        successHandler: observationsDialogSuccessHandler,
        cancelHandler: observationsDialogCancelHandler,
        openHandler: observationsDialogOpenHandler,
    } = useObservationsDialog(
        isLoading,
        showNotification,
        handleError,
        fetchData,
        ncrCode
    );

    useEffect(() => fetchData(ncrCode), [ncrCode, fetchData]);

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
                {observations?.length > 0 && (
                    <EISTable
                        data={observations}
                        headers={headers}
                        propCodes={propCodes}
                    />
                )}
                <div style={{ height: 15 }} />
                <div style={{ display: "flex", columnGap: 10 }}>
                    <Button
                        onClick={observationsDialogOpenHandler}
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
                handleSuccess={observationsDialogSuccessHandler}
                isOpen={isObservationsDialogOpen}
                handleCancel={observationsDialogCancelHandler}
                fields={observationFields}
                isDisabled={isObservationsDialogDisabled}
                observation={observation}
                handleUpdate={observationsDialogUpdateHandler}
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

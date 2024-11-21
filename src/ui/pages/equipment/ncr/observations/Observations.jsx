import { useState, useEffect, useCallback } from "react";
import WSNCRs from "@/tools/WSNCRs";
import EISTable from "eam-components/dist/ui/components/table";
import BlockUi from "react-block-ui";
import ObservationsDialog from "./components/ObservationsDialog";
import useLayoutStore from "@/state/layoutStore";
import WorkOrdersDialog from "./components/WorkOrdersDialog";
import useUserDataStore from "@/state/userDataStore";
import useObservationsDialog from "./hooks/useObservationsDialog";
import useWorkOrdersDialog from "./hooks/useWorkOrdersDialog";
import ObservationsActions from "./components/ObservationsActions";

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

    const {
        isOpen: isWorkOrdersDialogOpen,
        isDisabled: isWorkOrdersDialogDisabled,
        workOrder,
        updateHandler: workOrdersDialogUpdateHandler,
        successHandler: workOrdersDialogSuccessHandler,
        cancelHandler: workOrdersDialogCancelHandler,
        openHandler: workOrdersDialogOpenHandler,
    } = useWorkOrdersDialog(
        isLoading,
        showNotification,
        handleError,
        observationsDialogSuccessHandler,
        ncrCode
    );

    useEffect(() => fetchData(ncrCode), [ncrCode, fetchData]);

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
                <ObservationsActions
                    disabled={disabled}
                    handleAddObservationClick={observationsDialogOpenHandler}
                    handleCreateWorkOrderClick={workOrdersDialogOpenHandler}
                />
            </div>
            <ObservationsDialog
                handleSuccess={observationsDialogSuccessHandler}
                open={isObservationsDialogOpen}
                handleCancel={observationsDialogCancelHandler}
                fields={observationFields}
                disabled={isObservationsDialogDisabled}
                observation={observation}
                handleUpdate={observationsDialogUpdateHandler}
            />
            <WorkOrdersDialog
                handleSuccess={workOrdersDialogSuccessHandler}
                open={isWorkOrdersDialogOpen}
                handleCancel={workOrdersDialogCancelHandler}
                fields={workOrderFields}
                disabled={isWorkOrdersDialogDisabled}
                workOrder={workOrder}
                handleUpdate={workOrdersDialogUpdateHandler}
                userData={userData}
                statuses={statuses}
            />
        </>
    );
};

export default Observations;

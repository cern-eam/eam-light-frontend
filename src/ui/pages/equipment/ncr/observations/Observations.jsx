import BlockUi from "react-block-ui";
import ObservationsDialog from "./components/ObservationsDialog";
import useLayoutStore from "@/state/useLayoutStore";
import WorkOrdersDialog from "./components/WorkOrdersDialog";
import useUserDataStore from "@/state/useUserDataStore";
import useObservationsDialog from "./hooks/useObservationsDialog";
import useWorkOrdersDialog from "./hooks/useWorkOrdersDialog";
import ObservationsActions from "./components/ObservationsActions";
import ObservationsTable from "./components/ObservationsTable";
import useObservations from "./hooks/useObservations";
import { useEffect } from "react";

const Observations = ({
    ncrCode,
    showNotification,
    disabled,
    handleError,
    observationFields,
    statuses,
    ncr
}) => {
    const { userData } = useUserDataStore();

    const {screenLayout: {OSJOBS: ncrWorkOrderLayout }, fetchScreenLayout} = useLayoutStore();

    useEffect(() => {
        if (!ncrWorkOrderLayout) {
            fetchScreenLayout(userData.eamAccount.userGroup, "OBJ", "OSJOBS", "OSJOBS", [])
        }
    }, [ncrWorkOrderLayout])

    const { observations, isLoading, fetchData } = useObservations(
        ncrCode,
        handleError
    );
    
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
        {
            statusCode: "R",
            typeCode: "CD",
            assignedTo: userData?.eamAccount?.userGroup,
            equipmentCode: ncr?.equipmentCode
        }
    );

    return (isLoading || !ncrWorkOrderLayout) ? (
        <BlockUi tag="div" blocking={isLoading} style={{ width: "100%" }} />
    ) : (
        <>
            <div
                style={{ display: "flex", flexDirection: "column", rowGap: 15 }}
            >
                {observations?.length && (
                    <ObservationsTable observations={observations} />
                )}
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
                fields={ncrWorkOrderLayout.fields}
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

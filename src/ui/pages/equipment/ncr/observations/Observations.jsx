import BlockUi from "react-block-ui";
import ObservationsDialog from "./components/ObservationsDialog";
import useLayoutStore from "@/state/useLayoutStore";
import WorkOrdersDialog from "./components/WorkOrdersDialog";
import useUserDataStore from "@/state/useUserDataStore";
import ObservationsActions from "./components/ObservationsActions";
import ObservationsTable from "./components/ObservationsTable";
import useObservations from "./hooks/useObservations";
import { useEffect, useState } from "react";

const Observations = ({
    ncr,
    ncrCode,
    disabled,
    handleError,
}) => {
    const { userData } = useUserDataStore();
    const [isObservationsDialogOpen, setObservationsDialogOpen] = useState(false);
    const [isWorkOrdersDialogOpen, setWorkOrdersDialogOpen] = useState(false);
    const {
        screenLayout: { OSJOBS: ncrWorkOrderLayout },
        fetchScreenLayout,
    } = useLayoutStore();

    useEffect(() => {
        if (!ncrWorkOrderLayout) {
            fetchScreenLayout(userData.eamAccount.userGroup, "OBJ", "OSJOBS", "OSJOBS", [] );
        }
    }, [ncrWorkOrderLayout]);

    const { observations, isLoading, fetchData } = useObservations(
        ncrCode,
        handleError
    );

    return isLoading || !ncrWorkOrderLayout ? (
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
                    handleAddObservationClick={setObservationsDialogOpen}
                    handleCreateWorkOrderClick={setWorkOrdersDialogOpen}
                />
            </div>
            <ObservationsDialog
                open={isObservationsDialogOpen}
                setOpen={setObservationsDialogOpen}
                fetchData={fetchData}
                ncrCode={ncrCode}
            />
            <WorkOrdersDialog
                open={isWorkOrdersDialogOpen}
                setOpen={setWorkOrdersDialogOpen}
                ncrCode={ncrCode}
                ncr={ncr}
                fetchData={fetchData}
            />
        </>
    );
};

export default Observations;

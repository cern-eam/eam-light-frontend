import { useCallback, useMemo, useState } from "react";
import WSNCRs from "../../../../../../tools/WSNCRs";
import { SUCCESS_DIALOG_MESSAGE } from "../constants/observationsDialog";

const useObservationsDialog = (
    isObservationsLoading,
    showNotification,
    handleError,
    fetchData,
    ncrCode
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [observation, setObservation] = useState({});

    const isDisabled = useMemo(
        () => isLoading || isObservationsLoading,
        [isLoading, isObservationsLoading]
    );

    const updateHandler = useCallback((key, value) => {
        setObservation((prev) => ({ ...prev, [key]: value }));
    }, []);

    const successHandler = useCallback(
        async (observation) => {
            try {
                setIsLoading(true);
                await WSNCRs.createObservation({
                    ...observation,
                    nonConformityCode: ncrCode,
                });
                showNotification(SUCCESS_DIALOG_MESSAGE);
                setIsOpen(false);
                fetchData(ncrCode);
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchData, ncrCode]
    );

    const cancelHandler = useCallback(() => setIsOpen(false), []);

    const openHandler = useCallback(() => setIsOpen(true), []);

    return {
        isOpen,
        isDisabled,
        observation,
        updateHandler,
        successHandler,
        cancelHandler,
        openHandler,
    };
};

export default useObservationsDialog;

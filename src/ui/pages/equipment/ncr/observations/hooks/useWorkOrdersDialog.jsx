import { useCallback, useMemo, useState } from "react";
import { SUCCESS_DIALOG_MESSAGE } from "../constants/workOrdersDialog";

const useWorkOrdersDialog = (
    isObservationsLoading,
    showNotification,
    handleError,
    observationsDialogSuccessHandler
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const isDisabled = useMemo(
        () => isLoading || isObservationsLoading,
        [isLoading, isObservationsLoading]
    );

    const successHandler = async (workOrderCode) =>  {
        try {
            showNotification(SUCCESS_DIALOG_MESSAGE);
            await observationsDialogSuccessHandler({jobNum:workOrderCode });
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const cancelHandler = useCallback(() => setIsOpen(false), []);

    const openHandler = useCallback(() => setIsOpen(true), []);

    return {
        isOpen,
        isDisabled,
        successHandler,
        cancelHandler,
        openHandler,
    };
};

export default useWorkOrdersDialog;

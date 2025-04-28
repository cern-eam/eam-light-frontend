import { useCallback, useMemo, useState } from "react";
import WSWorkorders from "@/tools/WSWorkorders";
import { SUCCESS_DIALOG_MESSAGE } from "../constants/workOrdersDialog";

const useWorkOrdersDialog = (
    isObservationsLoading,
    showNotification,
    handleError,
    observationsDialogSuccessHandler,
    workOrderDefaults
) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [workOrder, setWorkOrder] = useState({
        ...workOrderDefaults
    });

    const isDisabled = useMemo(
        () => isLoading || isObservationsLoading,
        [isLoading, isObservationsLoading]
    );

    const updateHandler = useCallback((key, value) => {
        setWorkOrder((prev) => ({ ...prev, [key]: value }));
    }, []);

    const successHandler = useCallback(async () => {
        try {
            console.log('wo', workOrder) //TODO
            const response = await WSWorkorders.createWorkOrder(workOrder);
            
            showNotification(SUCCESS_DIALOG_MESSAGE);
            await observationsDialogSuccessHandler({
                jobNum: response.body.data,
            });
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [observationsDialogSuccessHandler, workOrder]);

    const cancelHandler = useCallback(() => setIsOpen(false), []);

    const openHandler = useCallback(() => setIsOpen(true), []);

    return {
        isOpen,
        isDisabled,
        workOrder,
        updateHandler,
        successHandler,
        cancelHandler,
        openHandler,
    };
};

export default useWorkOrdersDialog;

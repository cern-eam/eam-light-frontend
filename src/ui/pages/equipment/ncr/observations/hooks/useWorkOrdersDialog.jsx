import { useCallback, useMemo, useState } from "react";
import WSWorkorders from "@/tools/WSWorkorders";
import { SUCCESS_DIALOG_MESSAGE } from "../constants/workOrdersDialog";
import { getOrg } from "../../../../../../hooks/tools";

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

    function transformToWorkOrder(input) {
        return {
          WORKORDERID: {
            JOBNUM: "",
            ORGANIZATIONID: {
              ORGANIZATIONCODE: input.equipmentOrganization || getOrg()
            },
            ...(input.description && { DESCRIPTION: input.description })
          },
          ...(input.statusCode && { STATUS: { STATUSCODE: input.statusCode } }),
          ...(input.typeCode && { TYPE: { TYPECODE: input.typeCode } }),
          ...(input.equipmentCode && { EQUIPMENTID: { EQUIPMENTCODE: input.equipmentCode, ORGANIZATIONID: { ORGANIZATIONCODE: input.equipmentOrganization || getOrg() } } }),
          ...(input.departmentCode && { DEPARTMENTID: { DEPARTMENTCODE: input.departmentCode, ORGANIZATIONID: { ORGANIZATIONCODE: getOrg() } } }),
          ...(input.costCode && { COSTCODEID: { COSTCODE: input.costCode, ORGANIZATIONID: { ORGANIZATIONCODE: getOrg() } } }),
          ...(input.locationCode && { LOCATIONID: { LOCATIONCODE: input.locationCode, ORGANIZATIONID: { ORGANIZATIONCODE: input.locationOrg || getOrg() } } }),
          ...(input.assignedTo && { ASSIGNEDTO: { PERSONCODE: input.assignedTo } })
        };
      }
      
      

    const successHandler = useCallback(async () => {
        try {
            const response = await WSWorkorders.createWorkOrder(transformToWorkOrder(workOrder));
            console.log('resp', response)
            showNotification(SUCCESS_DIALOG_MESSAGE);
            await observationsDialogSuccessHandler({
                jobNum: response.body.Result.ResultData.JOBNUM
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

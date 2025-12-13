import WS from "@/tools/WS";
import WSWorkorders from "@/tools/WSWorkorders";
import WSWorkorder from "@/tools/WSWorkorders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isDepartmentReadOnly } from "@/ui/pages/EntityTools";
import { useEffect, useState } from "react";
import useUserDataStore from "../../../../../../state/useUserDataStore";
import { autocompleteDepartment } from "../../../../../../tools/WSGrids";
import { GridTypes } from "../../../../../../tools/entities/GridRequest";
import useEntity from "../../../../../../hooks/useEntity";
import { getOrg } from "../../../../../../hooks/tools";
import { ncrWorkOrderPropertiesMap } from "../../../../work/WorkorderTools";

const WorkOrdersDialog = ({
    entity: workOrder,
    handleSuccess,
    open,
    handleCancel,
    disabled,
    ncr,
}) => {
    const [statuses, setStatuses] = useState([]);
    const {userData} = useUserDataStore();

    const readStatuses = (status, type, newwo) => {
        WSWorkorders.getWorkOrderStatusValues(status, newwo)
        .then((response) => setStatuses(response.body.data))
        .catch(console.error);
    };

    useEffect( () => readStatuses("", "", true), [])

    const {
        saveHandler,
        register,
        loading,
        updateEntityProperty: updateWorkorderProperty,
        handleError,
    } = useEntity({
        WS: {
            create: WSWorkorder.createWorkOrder,
            new: WSWorkorder.initWorkOrder
        },
        postActions: {
            new: postInit,
            create: postCreate
        },
        resultDataCodeProperty: "JOBNUM",
        screenProperty: "ncrWorkOrderScreen",
        entityCode: "EVNT",
        explicitIdentifier: ``,
        updateWindowTitle: false,
        screenPermissions: userData.screens.WSJOBS,
        layoutPropertiesMap: ncrWorkOrderPropertiesMap
    });

    function postCreate(entityToCreate, response, workOrderCode) {
        handleSuccess(workOrderCode)
    }

    function postInit(wo) {
        updateWorkorderProperty("WORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE", getOrg());
        updateWorkorderProperty("EQUIPMENTID", ncr?.EQUIPMENTID);
        updateWorkorderProperty("DEPARTMENTID.DEPARTMENTCODE", userData?.eamAccount?.department);
        updateWorkorderProperty("ASSIGNEDTO.PERSONCODE", userData?.eamAccount?.employeeCode);
    }

    return (
        <Dialog
            fullWidth
            id="addNcrWorkOrderDialog"
            open={open}
            onClose={handleCancel}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Add Work Order</DialogTitle>

            <DialogContent id="content" style={{ overflowY: "visible" }}>
                <BlockUi tag="div" blocking={disabled}>
                    <EAMAutocomplete
                        {...register("equipment")} 
                        barcodeScanner 
                        //link={() => workOrder?.EQUIPMENTID?.EQUIPMENTCODE  ? "/equipment/" + workOrder.EQUIPMENTID.EQUIPMENTCODE : null}
                    />

                    <EAMTextField {...register("description")}  />

                    <EAMSelect {...register("workordertype")}
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        autocompleteHandler={
                            WSWorkorders.getWorkOrderTypeValues
                        }
                        autocompleteHandlerParams={[
                            userData.eamAccount.userGroup,
                        ]}
                    />

                    <EAMSelect {...register("workorderstatus")}
                        // disabled={
                        //     isDepartmentReadOnly(
                        //         workOrder.departmentCode,
                        //         userData
                        //     )
                        //     // ||
                        //     // !screenPermissions.updateAllowed ||
                        //     // !workOrder.jtAuthCanUpdate
                        // }
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        options={statuses}
                    />

                    <EAMAutocomplete {...register("department")} 
                                    autocompleteHandler={autocompleteDepartment}
                        // {...processElementInfo(fields["department"])}
                        // value={workOrder.departmentCode}
                        // onChange={createOnChangeHandler(
                        //     "departmentCode",
                        //     "departmentDesc",
                        //     null,
                        //     handleUpdate
                        // )}
                        // autocompleteHandler={autocompleteDepartment}
                        // validate
                    />

                    <EAMAutocomplete {...register("location")} />

                    <EAMAutocomplete {...register("costcode")} />

                    <EAMAutocomplete {...register("assignedto")}  />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancel}
                    color="primary"
                    disabled={disabled}
                >
                    Cancel
                </Button>
                <Button
                    onClick={saveHandler}
                    color="primary"
                    disabled={disabled}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WorkOrdersDialog;

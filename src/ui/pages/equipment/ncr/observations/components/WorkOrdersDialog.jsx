import WS from "@/tools/WS";
import WSWorkorders from "@/tools/WSWorkorders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import {
    createOnChangeHandler,
    processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { isDepartmentReadOnly } from "@/ui/pages/EntityTools";
import { useEffect, useState } from "react";
import useUserDataStore from "../../../../../../state/useUserDataStore";
import { autocompleteDepartment } from "../../../../../../tools/WSGrids";
import { createAutocompleteHandler } from "../../../../../../hooks/tools";

const WorkOrdersDialog = ({
    handleSuccess,
    open,
    handleCancel,
    fields,
    disabled,
    workOrder,
    handleUpdate
}) => {
    const [statuses, setStatuses] = useState([]);
    const {userData} = useUserDataStore();

    const readStatuses = (status, type, newwo) => {
        WSWorkorders.getWorkOrderStatusValues(status, newwo)
        .then((response) => setStatuses(response.body.data))
        .catch(console.error);
    };

    useEffect( () => readStatuses("", "", true), [])

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
                        {...processElementInfo(fields["equipment"])}
                        barcodeScanner
                        autocompleteHandler={WS.autocompleteEquipment}
                        autocompleteHandlerParams={[false]}
                        value={workOrder.equipmentCode}
                        onChange={createOnChangeHandler(
                            "equipmentCode",
                            "equipmentDesc",
                            "equipmentOrganization",
                            handleUpdate
                        )}
                        link={() =>
                            workOrder.equipmentCode
                                ? "/equipment/" + workOrder.equipmentCode
                                : null
                        }
                    />

                    <EAMTextField
                        {...processElementInfo(fields["description"])}
                        value={workOrder.severity}
                        onChange={createOnChangeHandler(
                            "description",
                            null,
                            null,
                            handleUpdate
                        )}
                    />

                    <EAMSelect
                        {...processElementInfo(fields["workordertype"])}
                        value={workOrder.typeCode}
                        onChange={createOnChangeHandler(
                            "typeCode",
                            "typeDesc",
                            null,
                            handleUpdate
                        )}
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        autocompleteHandler={
                            WSWorkorders.getWorkOrderTypeValues
                        }
                        autocompleteHandlerParams={[
                            userData.eamAccount.userGroup,
                        ]}
                    />

                    <EAMSelect
                        {...processElementInfo(fields["workorderstatus"])}
                        value={workOrder.statusCode}
                        onChange={createOnChangeHandler(
                            "statusCode",
                            "statusDesc",
                            null,
                            handleUpdate
                        )}
                        disabled={
                            isDepartmentReadOnly(
                                workOrder.departmentCode,
                                userData
                            )
                            // ||
                            // !screenPermissions.updateAllowed ||
                            // !workOrder.jtAuthCanUpdate
                        }
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        options={statuses}
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["department"])}
                        value={workOrder.departmentCode}
                        onChange={createOnChangeHandler(
                            "departmentCode",
                            "departmentDesc",
                            null,
                            handleUpdate
                        )}
                        autocompleteHandler={autocompleteDepartment}
                        autocompleteHandlerParams={["*"]}
                        validate
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["location"])}
                        {...createAutocompleteHandler(fields.location, fields, {})}
                        value={workOrder.locationCode}
                        onChange={createOnChangeHandler(
                            "locationCode",
                            "locationDesc",
                            null,
                            handleUpdate
                        )}
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["costcode"])}
                        value={workOrder.costCode}
                        onChange={createOnChangeHandler(
                            "costCode",
                            "costCodeDesc",
                            null,
                            handleUpdate
                        )}
                        autocompleteHandler={WSWorkorders.autocompleteCostCode}
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["assignedto"])}
                        {...createAutocompleteHandler(fields.assignedto, fields, {}, {resultMap: {code: "personcode", desc: "description"}})}
                        value={workOrder.assignedTo}
                        onChange={createOnChangeHandler(
                            "assignedTo",
                            "assignedToDesc",
                            null,
                            handleUpdate
                        )}
                    />
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
                    onClick={handleSuccess}
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

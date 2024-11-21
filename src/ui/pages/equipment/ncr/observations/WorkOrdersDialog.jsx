import { useCallback, useState } from "react";
import WS from "../../../../../tools/WS";
import WSWorkorders from "../../../../../tools/WSWorkorders";
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
import { IconButton } from "@mui/material";
import { FileTree } from "mdi-material-ui";
import { isDepartmentReadOnly } from "../../../../pages/EntityTools";

const WorkOrdersDialog = ({
    successHandler,
    isDialogOpen,
    handleCancel,
    isLoading,
    fields,
    userData,
    statuses,
}) => {
    const [workOrder, setWorkOrder] = useState({});
    const [loading, setLoading] = useState(false);

    const updateWorkOrderProperty = useCallback((key, value) => {
        setWorkOrder((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSave = useCallback(async () => {
        setLoading(true);
        await successHandler(workOrder);
        setLoading(false);
    }, [workOrder]);

    console.log("userData", userData);

    // const treeButtonClickHandler = (code) => {
    //     setLayoutProperty("equipment", {
    //         code: workorder.equipmentCode,
    //         organization: workorder.equipmentOrganization,
    //     });
    //     setLayoutProperty("showEqpTree", true);
    // };

    return (
        <Dialog
            fullWidth
            id="addNcrWorkOrderDialog"
            open={isDialogOpen}
            onClose={handleCancel}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Add Work Order</DialogTitle>

            <DialogContent id="content" style={{ overflowY: "visible" }}>
                <BlockUi tag="div" blocking={loading || isLoading}>
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
                            updateWorkOrderProperty
                        )}
                        link={() =>
                            workOrder.equipmentCode
                                ? "/equipment/" + workOrder.equipmentCode
                                : null
                        }
                        endAdornment={
                            <IconButton
                                size="small"
                                // onClick={treeButtonClickHandler}
                                disabled={!workOrder.equipmentCode}
                            >
                                <FileTree />
                            </IconButton>
                        }
                    />

                    <EAMTextField
                        {...processElementInfo(fields["description"])}
                        value={workOrder.severity}
                        onChange={createOnChangeHandler(
                            "description",
                            null,
                            null,
                            updateWorkOrderProperty
                        )}
                    />

                    <EAMSelect
                        {...processElementInfo(fields["workordertype"])}
                        value={workOrder.typeCode}
                        onChange={createOnChangeHandler(
                            "typeCode",
                            "typeDesc",
                            null,
                            updateWorkOrderProperty
                        )}
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        autocompleteHandler={
                            WSWorkorders.getWorkOrderTypeValues
                        }
                        // autocompleteHandlerParams={[
                        //     userData.eamAccount.userGroup,
                        // ]}
                    />

                    <EAMSelect
                        {...processElementInfo(fields["workorderstatus"])}
                        value={workOrder.statusCode}
                        onChange={createOnChangeHandler(
                            "statusCode",
                            "statusDesc",
                            null,
                            updateWorkOrderProperty
                        )}
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

                    <EAMAutocomplete
                        {...processElementInfo(fields["department"])}
                        value={workOrder.departmentCode}
                        onChange={createOnChangeHandler(
                            "departmentCode",
                            "departmentDesc",
                            null,
                            updateWorkOrderProperty
                        )}
                        autocompleteHandler={WS.autocompleteDepartment}
                        validate
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["location"])}
                        value={workOrder.locationCode}
                        onChange={createOnChangeHandler(
                            "locationCode",
                            "locationDesc",
                            null,
                            updateWorkOrderProperty
                        )}
                        autocompleteHandler={WS.autocompleteLocation}
                    />

                    <EAMAutocomplete
                        {...processElementInfo(fields["costcode"])}
                        value={workOrder.costCode}
                        onChange={createOnChangeHandler(
                            "costCode",
                            "costCodeDesc",
                            null,
                            updateWorkOrderProperty
                        )}
                        autocompleteHandler={WSWorkorders.autocompleteCostCode}
                    />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancel}
                    color="primary"
                    disabled={loading || isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    disabled={loading || isLoading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WorkOrdersDialog;

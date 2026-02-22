import WSWorkorders from "@/tools/WSWorkorders";
import WSWorkorder from "@/tools/WSWorkorders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import { useEffect, useState } from "react";
import useUserDataStore from "@/state/useUserDataStore";
import { autocompleteDepartment } from "@/tools/WSGrids";
import useEntity from "@/hooks/useEntity";
import { getOrg } from "@/hooks/tools";
import { ncrWorkOrderPropertiesMap } from "@/ui/pages/work/WorkorderTools";
import WSNCRs from "@/tools/WSNCRs";
import EAMComboAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete";

const WorkOrdersDialog = ({
    open,
    disabled,
    setOpen,
    fetchData,
    ncrCode,
    ncr,
}) => {

    if (!open || !ncrCode) {
        return null
    }

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
        pageMode: false,
        screenPermissions: userData.screens.WSJOBS,
        layoutPropertiesMap: ncrWorkOrderPropertiesMap
    });

    async function postCreate(entityToCreate, response, workOrderCode) {
        const req = {
            NONCONFORMITYOBSERVATIONID: {
                NONCONFORMITYCODE: ncrCode,
                ORGANIZATIONID: {ORGANIZATIONCODE: '*'}
            },
            OBTrackingDetails: {
                WORKORDERID: {
                    JOBNUM: workOrderCode,
                    ORGANIZATIONID: {ORGANIZATIONCODE: '*'}
                }
            },
            OBSERVATIONSTATUS: {
                STATUSCODE: 'U'
            }
        }
        await WSNCRs.createObservation(req)
        setOpen(false)
        fetchData(ncrCode)
    }

    function handleCancel() {
        setOpen(false)
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
                    <EAMComboAutocomplete {...register("equipment")} 
                        barcodeScanner 
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
                        renderSuggestion={(suggestion) => suggestion.desc}
                        renderValue={(value) => value.desc || value.code}
                        options={statuses}
                    />

                    <EAMComboAutocomplete {...register("department")} 
                                    autocompleteHandler={autocompleteDepartment}
                    />

                    <EAMComboAutocomplete {...register("location")} />

                    <EAMComboAutocomplete {...register("costcode")} />

                    <EAMComboAutocomplete {...register("assignedto")}  />
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

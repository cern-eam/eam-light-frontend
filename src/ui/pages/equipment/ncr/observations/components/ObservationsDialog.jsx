import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import {
    createOnChangeHandler,
    processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";

const ObservationsDialog = ({
    handleSuccess,
    open,
    handleCancel,
    fields,
    disabled,
    observation,
    handleUpdate,
}) => {
    const [lists, setLists] = useState({
        observationStatusCode: [{ code: "U", desc: "Unfinished" }],
        severity: [{ code: "HIGH", desc: "High" }],
    });

    return (
        <Dialog
            fullWidth
            id="addObservationDialog"
            open={open}
            onClose={handleCancel}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Add Observation</DialogTitle>

            <DialogContent id="content" style={{ overflowY: "visible" }}>
                <BlockUi tag="div" blocking={disabled}>
                    <EAMSelect
                        {...processElementInfo(fields["status"])}
                        options={lists.observationStatusCode}
                        value={observation.observationStatusCode}
                        onChange={createOnChangeHandler(
                            "observationStatusCode",
                            null,
                            null,
                            handleUpdate
                        )}
                    />
                    <EAMSelect
                        {...processElementInfo(fields["severity"])}
                        options={lists.severity}
                        value={observation.severity}
                        onChange={createOnChangeHandler(
                            "severity",
                            null,
                            null,
                            handleUpdate
                        )}
                    />
                    <EAMTextField
                        {...processElementInfo(fields["note"])}
                        value={observation.note}
                        onChange={createOnChangeHandler(
                            "note",
                            null,
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
                    onClick={() => handleSuccess(observation)}
                    color="primary"
                    disabled={disabled}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ObservationsDialog;

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import WSNCRs from "../../../../../tools/WSNCRs";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import {
    createOnChangeHandler,
    processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";

const ObservationsDialog = (props) => {
    const [observation, setObservation] = useState({});
    const [lists, setLists] = useState({
        observationStatusCode: [{ code: "U", desc: "Unfinished" }],
        severity: [{ code: "HIGH", desc: "High" }],
    });
    const [loading, setLoading] = useState(false);

    const updateObservationProperty = (key, value) => {
        setObservation((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setLoading(true);
        WSNCRs.createObservation({
            ...observation,
            nonConformityCode: props.ncr.code,
        })
            .then(props.successHandler)
            .catch(props.handleError)
            .finally(() => setLoading(false));
    };

    return (
        <Dialog
            fullWidth
            id="addObservationDialog"
            open={props.isDialogOpen}
            onClose={props.handleCancel}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Add Observation</DialogTitle>

            <DialogContent id="content" style={{ overflowY: "visible" }}>
                <BlockUi tag="div" blocking={loading || props.isLoading}>
                    <EAMSelect
                        {...processElementInfo(props.tabLayout["status"])}
                        options={lists.observationStatusCode}
                        value={observation.observationStatusCode}
                        onChange={createOnChangeHandler(
                            "observationStatusCode",
                            null,
                            null,
                            updateObservationProperty
                        )}
                    />
                    <EAMSelect
                        {...processElementInfo(props.tabLayout["severity"])}
                        options={lists.severity}
                        value={observation.severity}
                        onChange={createOnChangeHandler(
                            "severity",
                            null,
                            null,
                            updateObservationProperty
                        )}
                    />
                    <EAMTextField
                        {...processElementInfo(props.tabLayout["note"])}
                        value={observation.note}
                        onChange={createOnChangeHandler(
                            "note",
                            null,
                            null,
                            updateObservationProperty
                        )}
                    />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={props.handleCancel}
                    color="primary"
                    disabled={loading || props.isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    disabled={loading || props.isLoading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ObservationsDialog;

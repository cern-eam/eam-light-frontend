import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import BlockUi from "react-block-ui";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import WSNCRs from "@/tools/WSNCRs";
import useEntity from "@/hooks/useEntity";

const ObservationsDialog = ({
    open,
    setOpen,
    fetchData,
    ncrCode
}) => {
    if (!open || !ncrCode) {
        return null
    }

    const {
        saveHandler,
        register,
        loading,
        updateEntityProperty: updateObservationProperty,
        handleError,
    } = useEntity({
        WS: {
            create: WSNCRs.createObservation,
            new: WSNCRs.getObservationDefault
        },
        postActions: {
            new: postInit,
            create: postCreate
        },
        screenProperty: "ncrScreen",
        tabCode: "OBS",
        explicitIdentifier: ``,
        pageMode: false,
        resultDefaultDataProperty: 'NonconformityObservationDefault'
    });

    function postInit() {
        updateObservationProperty('NONCONFORMITYOBSERVATIONID.NONCONFORMITYCODE', ncrCode)
        updateObservationProperty('NONCONFORMITYOBSERVATIONID.ORGANIZATIONID.ORGANIZATIONCODE', '*')
    }

    function postCreate() {
        setOpen(false)
        fetchData(ncrCode)
    }

    function handleCancel() {
        setOpen(false)
    }

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
                <BlockUi tag="div" blocking={false}> // TODO
                    <EAMSelect {...register('status')}
                        options={[{ code: "U", desc: "Unfinished" }]}
                    />
                    <EAMSelect {...register('severity')}
                        options={[{ code: "HIGH", desc: "High" }]}

                    />
                    <EAMTextField {...register('note')} />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCancel}
                    color="primary"
                    disabled={false}
                >
                    Cancel
                </Button>
                <Button
                    onClick={saveHandler}
                    color="primary"
                    disabled={false}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ObservationsDialog;

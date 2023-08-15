import React, {useState} from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import KeyCode from "eam-components/dist/enums/KeyCode";
import LightDialog from 'ui/components/LightDialog';
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";
import {tokens} from "../../../../../AuthWrapper";

/**
 * Display detail of an activity
 */
function PreviewDocumentsDialog(props) {

    let [loading, setLoading] = useState(false);

    let handleClose = () => {
        props.onClose();
    };

    let onKeyDown = (e) => {
        if (e.keyCode === KeyCode.ENTER) {
            e.stopPropagation();
        }
    }

    const headers = {
        "Authorization": `Bearer ${props.token}`,
    }

    return (
        <div onKeyDown={onKeyDown}>
            <LightDialog
                fullWidth
                id="previewDocumentsDialog"
                open={props.open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Documents Viewer</DialogTitle>

                <DialogContent id="content">
                    <div>
                        <BlockUi tag="div" blocking={loading}>
                            <DocViewer documents={props.docs}
                                       requestHeaders={headers}
                                       prefetchMethod="GET"
                                       initialActiveDocument={props.docs[0]} pluginRenderers={DocViewerRenderers}/>;
                        </BlockUi>
                    </div>
                </DialogContent>

                <DialogActions>
                    <div>
                        <Button onClick={handleClose} color="primary" disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </DialogActions>

            </LightDialog>
        </div>
    );
}

export default PreviewDocumentsDialog;
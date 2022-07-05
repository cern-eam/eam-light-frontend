import React, { useEffect, useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import IconButton from '@mui/material/IconButton';
import { BarcodeScan } from 'mdi-material-ui';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const EAMBarcodeScanner = (props) => {
    let {updateProperty, valueKey} = props;

    let codeReader = useRef(null);
    let [open, setOpen] = useState(false);
    let [showBarcodeButton, setShowBarcodeButton] = useState(false);

    useEffect( () => {
        navigator.mediaDevices.enumerateDevices().then( deviceCount => {
            if (deviceCount.length > 0 && navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                setShowBarcodeButton(true)
            }
        });
    }, [])


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
        codeReader.current.reset();
    };

    const startScanner = () => {
        codeReader.current = new BrowserMultiFormatReader();
        codeReader.current
            .listVideoInputDevices()
            .then((videoInputDevices) => startDecoding(videoInputDevices[0].deviceId))
            .catch((err) => console.error(err));
    }

    const startDecoding = () => {
       codeReader.current
            .decodeFromInputVideoDevice(undefined, 'video')
            .then((result) => {
                onDetectedCallback(result.text);
                codeReader.current.reset();
                handleClose();
            })
            .catch((err) => console.error(err));
    };

    const onDetectedCallback = (result) => {
        updateProperty(valueKey, result);
        setOpen(false);
    }

    let iconButtonStyle = {
        backgroundColor: 'white',
        marginLeft: 3,
        width: 32,
        height: 32,
        zIndex: 100,
        padding: 0,
    };

        // Display just the children when no support for user media
        if (!showBarcodeButton) {
            return React.Fragment;
        }

        // Active quagga when support for user media
        return (
            <div>

                <IconButton
                    
                    onClick={handleClickOpen}
                    >
                    <BarcodeScan />
                </IconButton>

                <Dialog
                    TransitionProps={{
                        onEntered: () =>
                            startScanner(onDetectedCallback, handleClose),
                    }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{ maxWidth: 320, maxHeight: 320 }}>
                        <video id="video" width="200" height="200"></video>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }



export default EAMBarcodeScanner;
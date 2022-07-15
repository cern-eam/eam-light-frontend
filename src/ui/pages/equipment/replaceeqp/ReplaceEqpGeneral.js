import React, { useState } from 'react';
import EISPanel from 'eam-components/ui/components/panel';
import WS from "../../../../tools/WS";
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import Button from '@mui/material/Button';
import Refresh from '@mui/icons-material/Refresh';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import standard from './modes/mode_standard.svg';
import swapping from './modes/mode_swapping.svg';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const buttonStyle = {
    bottom: '-10px',
    left: '0px',
};

const MODE_STANDARD = 'Standard';
const MODE_SWAPPING = 'Swapping';

const ReplaceEqpGeneral = (props) => {
    const {
        children, // TODO: not clear whether this will be props or component variable or both
        equipmentLayout,
        onChangeNewEquipment,
        onChangeOldEquipment,
        replaceEquipmentHandler,
        replaceEquipment,
        stateList,
        statusList,
        showError,
        updateProperty,
    } = props;

    const [dialogOpen, setDialogOpen] = useState(false);

    // const children = {}; // TODO: is this logic required?

    const closeDialog = () => {
        setDialogOpen(false);
    };

    const openDialog = () => {
        //Validate fields
        if (!validateFields()) {
            showError('Please fill the required fields');
            return;
        }

        //They cannot be the same equipment
        if (replaceEquipment.oldEquipment === replaceEquipment.newEquipment) {
            showError('New Equipment cannot be the same Old Equipment');
            return;
        }
        setDialogOpen(true);
    };

    const executeReplace = () => {
        replaceEquipmentHandler();
        setDialogOpen(false);
    };

    // TODO: implement validation
    const validateFields = () => {
        console.log("Field validation being skipped at the moment");
        return true;
        // let validationPassed = true;
        // Object.keys(children).forEach(key => { // TODO: was `this.children`
        //     if (!children[key].validate()) {
        //         validationPassed = false;
        //     }
        // });
        // return validationPassed;
    };

    const renderImageMode = () => {
        const imageStandard = {
            backgroundImage: `url('${standard}')`,
        };

        const imageSwapping = {
            backgroundImage: `url('${swapping}')`,
        };

        return (
            <div>
                <h4 style={{marginBottom: '5px'}}>Replacement Mode</h4>
                <RadioGroup
                    aria-label="replacementMode"
                    name="replacementMode"
                    value={replaceEquipment.replacementMode}
                    onChange={event => updateProperty('replacementMode', event.target.value)}
                    style={{flexDirection: 'row'}}>

                    <FormControlLabel key={MODE_STANDARD} value={MODE_STANDARD} control={<Radio color="primary"/>}
                                      label={`Standard`}
                                      style={imageStandard}
                                      className={`imageRadio ${replaceEquipment.replacementMode === MODE_STANDARD ? 'optionSelected' : ''}`}/>

                    <FormControlLabel key={MODE_SWAPPING} value={MODE_SWAPPING} control=
                        {<Radio color="primary"/>} label={`Swapping`} style={imageSwapping}
                                      className={`imageRadio ${replaceEquipment.replacementMode === MODE_SWAPPING ? 'optionSelected' : ''}`}/>

                </RadioGroup>
            </div>
        );
    };

    return (
        <EISPanel heading="REPLACE EQUIPMENT" alwaysExpanded={true}>
            <div style={{width: "100%", marginTop: 0}}>

                <EAMAutocomplete elementInfo={{
                    ...equipmentLayout.fields['equipmentno'],
                    attribute: "R",
                    text: "Old Equipment", xpath: "OldEquipment"
                }}
                    value={replaceEquipment.oldEquipment}
                    updateProperty={updateProperty}
                    valueKey="oldEquipment"
                    autocompleteHandler={(val, conf) => WS.autocompleteEquipment(val, conf, true)}
                    onChangeValue={onChangeOldEquipment}
                    children={children}
                    desc={replaceEquipment.oldEquipmentDesc}
                    descKey="oldEquipmentDesc"
                    barcodeScanner/>

                <EAMSelect
                    elementInfo={{
                        ...equipmentLayout.fields['assetstatus'],
                        attribute: "R",
                        text: "Old Equipment Status after replacement",
                        readonly: statusList.length === 0
                    }}
                    valueKey="oldEquipmentStatus"
                    options={statusList}
                    value={replaceEquipment.oldEquipmentStatus}
                    updateProperty={updateProperty}
                    children={children} />
                
                <EAMSelect
                    elementInfo={{
                        ...equipmentLayout.fields['assetstate'],
                        attribute: "R",
                        text: "Old Equipment State after replacement",
                        readonly: !stateList || stateList.length === 0
                    }}
                    valueKey="oldEquipmentState"
                    options={stateList}
                    value={replaceEquipment.oldEquipmentState}
                    updateProperty={updateProperty}
                    children={children} />

                <EAMAutocomplete elementInfo={{
                    ...equipmentLayout.fields['equipmentno'],
                    attribute: "R",
                    text: "New Equipment", xpath: "NewEquipment"
                }}
                    value={replaceEquipment.newEquipment}
                    updateProperty={updateProperty}
                    valueKey="newEquipment"
                    autocompleteHandler={(val, conf) => WS.autocompleteEquipment(val, conf, true)}
                    onChangeValue={onChangeNewEquipment}
                    children={children}
                    desc={replaceEquipment.newEquipmentDesc}
                    descKey="newEquipmentDesc"
                    barcodeScanner/>

                {renderImageMode()}

                <Button onClick={openDialog} color="primary" style={buttonStyle}>
                    <Refresh/>
                    Replace Equipment
                </Button>

                <Dialog
                    open={dialogOpen}
                    onClose={closeDialog}>
                    <DialogTitle id="alert-dialog-title">{`Replace Equipment`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to
                            replace {replaceEquipment.oldEquipment} with {replaceEquipment.newEquipment}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={executeReplace} color="primary" autoFocus>
                            Replace Equipment
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </EISPanel>
    );
}

export default ReplaceEqpGeneral;
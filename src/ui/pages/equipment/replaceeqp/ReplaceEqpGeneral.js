import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import Button from '@material-ui/core/Button';
import Refresh from '@material-ui/icons/Refresh';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import standard from './modes/mode_standard.svg';
import swapping from './modes/mode_swapping.svg';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

const buttonStyle = {
    bottom: '-10px',
    left: '0px',
};

const MODE_STANDARD = 'Standard';
const MODE_SWAPPING = 'Swapping';

class ReplaceEqpGeneral extends Component {

    state = {
        dialogOpen: false
    };

    children = {};

    closeDialog = () => {
        this.setState(() => ({dialogOpen: false}));
    };

    openDialog = () => {
        //Validate fields
        if (!this.validateFields()) {
            this.props.showError('Please fill the required fields');
            return;
        }

        //They cannot be the same equipment
        if (this.props.replaceEquipment.oldEquipment === this.props.replaceEquipment.newEquipment) {
            this.props.showError('New Equipment cannot be the same Old Equipment');
            return;
        }
        this.setState(() => ({dialogOpen: true}));
    };

    executeReplace = () => {
        this.props.replaceEquipmentHandler();
        this.setState(() => ({dialogOpen: false}));
    };

    validateFields = () => {
        let validationPassed = true;
        Object.keys(this.children).forEach(key => {
            if (!this.children[key].validate()) {
                validationPassed = false;
            }
        });
        return validationPassed;
    };

    renderImageMode = () => {
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
                    value={this.props.replaceEquipment.replacementMode}
                    onChange={event => this.props.updateProperty('replacementMode', event.target.value)}
                    style={{flexDirection: 'row'}}>

                    <FormControlLabel key={MODE_STANDARD} value={MODE_STANDARD} control={<Radio color="primary"/>}
                                      label={`Standard`}
                                      style={imageStandard}
                                      className={`imageRadio ${this.props.replaceEquipment.replacementMode === MODE_STANDARD ? 'optionSelected' : ''}`}/>

                    <FormControlLabel key={MODE_SWAPPING} value={MODE_SWAPPING} control=
                        {<Radio color="primary"/>} label={`Swapping`} style={imageSwapping}
                                      className={`imageRadio ${this.props.replaceEquipment.replacementMode === MODE_SWAPPING ? 'optionSelected' : ''}`}/>

                </RadioGroup>
            </div>
        );
    };


    render() {
        return (
            <EISPanel heading="REPLACE EQUIPMENT" alwaysExpanded={true}>
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMBarcodeInput updateProperty={value => {this.props.onChangeOldEquipment(value); return this.props.updateProperty('oldEquipment', value)}} right={0} top={20}>
                        <EAMAutocomplete elementInfo={{
                            ...this.props.equipmentLayout.fields['equipmentno'],
                            attribute: "R",
                            text: "Old Equipment", xpath: "OldEquipment"
                        }}
                            value={this.props.replaceEquipment.oldEquipment}
                            updateProperty={this.props.updateProperty}
                            valueKey="oldEquipment"
                            autocompleteHandler={WSEquipment.autocompleteEquipmentReplacement}
                            onChangeValue={this.props.onChangeOldEquipment}
                            children={this.children}
                            valueDesc={this.props.replaceEquipment.oldEquipmentDesc}
                            descKey="oldEquipmentDesc"/>
                    </EAMBarcodeInput>

                    <EAMSelect
                        elementInfo={{
                            ...this.props.equipmentLayout.fields['assetstatus'],
                            attribute: "R",
                            text: "Old Equipment Status after replacement",
                            readonly: this.props.statusList.length === 0
                        }}
                        valueKey="oldEquipmentStatus"
                        values={this.props.statusList}
                        value={this.props.replaceEquipment.oldEquipmentStatus}
                        updateProperty={this.props.updateProperty}
                        children={this.children} />

                    <EAMSelect
                        elementInfo={{
                            ...this.props.equipmentLayout.fields['assetstate'],
                            attribute: "R",
                            text: "Old Equipment State after replacement",
                            readonly: !this.props.stateList || this.props.stateList.length === 0
                        }}
                        valueKey="oldEquipmentState"
                        values={this.props.stateList}
                        value={this.props.replaceEquipment.oldEquipmentState}
                        updateProperty={this.props.updateProperty}
                        children={this.children} />

                    <EAMBarcodeInput updateProperty={value => {this.props.onChangeNewEquipment(value); return this.props.updateProperty('newEquipment', value)}} right={0} top={20}>
                        <EAMAutocomplete elementInfo={{
                            ...this.props.equipmentLayout.fields['equipmentno'],
                            attribute: "R",
                            text: "New Equipment", xpath: "NewEquipment"
                        }}
                            value={this.props.replaceEquipment.newEquipment}
                            updateProperty={this.props.updateProperty}
                            valueKey="newEquipment"
                            autocompleteHandler={WSEquipment.autocompleteEquipmentReplacement}
                            onChangeValue={this.props.onChangeNewEquipment}
                            children={this.children}
                            valueDesc={this.props.replaceEquipment.newEquipmentDesc}
                            descKey="newEquipmentDesc"/>
                    </EAMBarcodeInput>

                    {this.renderImageMode()}

                    <Button onClick={this.openDialog} color="primary" style={buttonStyle}>
                        <Refresh/>
                        Replace Equipment
                    </Button>

                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.closeDialog}>
                        <DialogTitle id="alert-dialog-title">{`Replace Equipment`}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to
                                replace {this.props.replaceEquipment.oldEquipment} with {this.props.replaceEquipment.newEquipment}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.executeReplace} color="primary" autoFocus>
                                Replace Equipment
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </EISPanel>
        );
    }
}

export default ReplaceEqpGeneral;
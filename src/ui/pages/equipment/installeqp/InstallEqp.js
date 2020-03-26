import React, {useState} from 'react';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EISPanel from 'eam-components/dist/ui/components/panel';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import WSEquipment from "../../../../tools/WSEquipment";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';

export default function NameForm(props) {

    const [parentEq, setParentEq] = useState("");
    const [childEq, setChildEq] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const createEquipmentStructure = (newParent, child) => {
        return {
            newParentCode: newParent,
            childCode: child
        };
    }

    const installEqpHandler = (code) => {
        setButtonDisabled(true);        
        if(code){
            WSEquipment.installEquipment(code).then(response => {
                props.showNotification("Equipment installed.");
                setButtonDisabled(false); 
            }).catch(error => {
                props.handleError(error);
                setButtonDisabled(false); 
            });
            
        }
    }

    return (
    <EISPanel heading="Install Equipment">
        <div style={{width: "100%", marginTop: 0}}>

        <EAMBarcodeInput updateProperty={setParentEq}  right={0} top={16}>          
                <EAMAutocomplete elementInfo={{attribute: "O", text: "Parent Equipment"}}
                    value={parentEq}
                    updateProperty={setParentEq}
                    autocompleteHandler={WSEquipment.autocompletePositionParent}/>
                    
        </EAMBarcodeInput>

        <EAMBarcodeInput updateProperty={setChildEq}  right={0} top={16}>           
                <EAMAutocomplete elementInfo={{attribute: "O", text: "Child Equipment"}}    
                    value={childEq}
                    updateProperty={setChildEq}
                    autocompleteHandler={WSEquipment.autocompletePositionParent}/>
                    
        </EAMBarcodeInput>

        <Button onClick={() => installEqpHandler(createEquipmentStructure(parentEq, childEq))} color = "primary" variant = "contained" disabled = {buttonDisabled}>
                Install
        </Button>                    
            
        </div>
    </EISPanel>
    

    );
  }
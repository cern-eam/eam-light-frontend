import React, {useState} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import BlockUi from 'react-block-ui';

export default function NameForm(props) {

    const [parentEq, setParentEq] = useState("");
    const [childEq, setChildEq] = useState("");
    const [blocking, setBlocking] = useState(false);

    const createEquipmentStructure = (newParent, child) => {
        return {
            newParentCode: newParent,
            childCode: child
        };
    }

    const installEqpHandler = (code) => {
        setBlocking(true);
        if (code) {
            WSEquipment.installEquipment(code).then(response => {
                props.showNotification(`${childEq} was successfully attached to ${parentEq}`);
                setChildEq("");
                setParentEq("");
                setBlocking(false);
            }).catch(error => {
                props.handleError(error);
                setBlocking(false);
            });
        }
    }

    return (
        <div id="entityContainer" style={{height: "100%"}}>
            <BlockUi tag="div" blocking={blocking} style={{height: "100%", width: "100%"}}>
                <div id="entityContent" style={{height: "100%"}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <EISPanel heading="Install Equipment">
                                <div style={{width: "100%", marginTop: 0}}>
                                    <EAMBarcodeInput updateProperty={setParentEq} right={0} top={16}>
                                        <EAMAutocomplete elementInfo={{attribute: "O", text: "Parent"}}
                                                         value={parentEq}
                                                         valueKey="parent"
                                                         updateProperty={(key, value) => (key === 'parent') && setParentEq(value)}
                                                         autocompleteHandler={WS.autocompleteEquipment}/>
                                    </EAMBarcodeInput>

                                    <EAMBarcodeInput updateProperty={setChildEq} right={0} top={16}>
                                        <EAMAutocomplete elementInfo={{attribute: "O", text: "Child"}}
                                                         value={childEq}
                                                         valueKey="child"
                                                         updateProperty={(key, value) => (key === 'child') && setChildEq(value)}
                                                         autocompleteHandler={WS.autocompleteEquipment}/>
                                    </EAMBarcodeInput>

                                    <Button
                                        style={{marginTop: 10}}
                                        onClick={() => installEqpHandler(createEquipmentStructure(parentEq, childEq))}
                                        color="primary">
                                        LINK EQUIPMENT
                                    </Button>
                                </div>
                            </EISPanel>
                        </Grid>
                    </Grid>
                </div>
            </BlockUi>
        </div>
);
}
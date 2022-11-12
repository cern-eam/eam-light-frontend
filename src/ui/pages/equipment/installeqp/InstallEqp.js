import React, {useState, useEffect} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import BlockUi from 'react-block-ui';
import { createOnChangeHandler } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

export default function InstallEqp(props) {

    const [parentEq, setParentEq] = useState("");
    const [childEq, setChildEq] = useState("");
    const [blocking, setBlocking] = useState(false);

    const idPrefix = "EAMID_InstallEqp_";

    useEffect( () => {
        props.setLayoutProperty('eqpTreeMenu', {
            desc: "Use as Child Equipment",
            handler: rowInfo => {
                setChildEq(rowInfo.node.id)
            }
        });
        props.setLayoutProperty('equipment', null);
        props.setLayoutProperty('showEqpTree', false);
        return () => {
            props.setLayoutProperty('eqpTreeMenu', null);
        }
    }, [])

    const createEquipmentStructure = (newParent, child) => {
        return {
            newParentCode: newParent,
            childCode: child
        };
    }

    const installEqpHandler = (code) => {
        if (!parentEq || !childEq) {
            props.showError("Please provide the Child and Parent Equipment.");
            return;
        }

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
                            <EISPanel heading="INSTALL EQUIPMENT">
                                <div style={{width: "100%", marginTop: 0}}>
                                        <EAMAutocomplete
                                            required
                                            label={"Parent"}
                                            value={parentEq}
                                            onChange={createOnChangeHandler(null, null, null, null, parentEquipment => {
                                                props.setLayoutProperty('equipment', {code: parentEquipment});
                                                setParentEq(parentEquipment)
                                            })}
                                            autocompleteHandler={WS.autocompleteEquipment}
                                            autocompleteHandlerParams={[true]}
                                            barcodeScanner
                                            id={`${idPrefix}PARENT`}
                                        />

                                        <EAMAutocomplete 
                                            required
                                            label={"Child"}
                                            value={childEq}
                                            onChange={createOnChangeHandler(null, null, null, null, setChildEq)}
                                            autocompleteHandler={WS.autocompleteEquipment}
                                            autocompleteHandlerParams={[true]}
                                            barcodeScanner
                                            id={`${idPrefix}CHILD`}
                                        />

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
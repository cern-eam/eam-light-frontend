import React, { useState, useEffect } from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import WSEquipment from '../../../../tools/WSEquipment';
import WS from '../../../../tools/WS';
import EAMBarcodeInput from 'eam-components/dist/ui/components/muiinputs/EAMBarcodeInput';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import BlockUi from 'react-block-ui';

export default function NameForm(props) {
    const [parentEq, setParentEq] = useState('');
    const [parentEqDesc, setParentEqDesc] = useState('');
    const [childEq, setChildEq] = useState('');
    const [blocking, setBlocking] = useState(false);

    useEffect(() => {
        if (props.layout.eqpTreeCurrentNode) {
            setParentEq(props.layout.eqpTreeCurrentNode.id);
            setParentEqDesc(props.layout.eqpTreeCurrentNode.name);
        }
    }, [props.layout.eqpTreeCurrentNode]);

    const createEquipmentStructure = (newParent, child) => {
        return {
            newParentCode: newParent,
            childCode: child,
        };
    };

    const installEqpHandler = (code) => {
        if (!parentEq || !childEq) {
            props.showError('Please provide the Child and Parent Equipment.');
            return;
        }

        setBlocking(true);
        if (code) {
            WSEquipment.installEquipment(code)
                .then((response) => {
                    props.showNotification(`${childEq} was successfully attached to ${parentEq}`);

                    props.setLayoutProperty('eqpTreeParent', parentEq);
                    props.setLayoutProperty('eqpTreeChild', childEq);
                    setChildEq('');
                    setParentEq('');
                    setBlocking(false);
                })
                .catch((error) => {
                    props.handleError(error);
                    setBlocking(false);
                });
        }
    };

    const changeParentHandler = (code) => {
        props.setLayoutProperty('equipment', { code: code });
        props.setLayoutProperty('showEqpTreeButton', true);
    };

    return (
        <div id="entityContainer" style={{ height: '100%' }}>
            <BlockUi tag="div" blocking={blocking} style={{ height: '100%', width: '100%' }}>
                <div id="entityContent" style={{ height: '100%' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <EISPanel heading="INSTALL EQUIPMENT">
                                <div style={{ width: '100%', marginTop: 0 }}>
                                    <EAMBarcodeInput updateProperty={setParentEq} right={0} top={16}>
                                        <EAMAutocomplete
                                            elementInfo={{ attribute: 'R', text: 'Parent' }}
                                            value={parentEq}
                                            valueKey="parent"
                                            onChangeValue={changeParentHandler}
                                            updateProperty={(key, value) => key === 'parent' && setParentEq(value)}
                                            autocompleteHandler={WS.autocompleteEquipment}
                                        />
                                    </EAMBarcodeInput>

                                    <EAMBarcodeInput updateProperty={setChildEq} right={0} top={16}>
                                        <EAMAutocomplete
                                            elementInfo={{ attribute: 'R', text: 'Child' }}
                                            value={childEq}
                                            valueKey="child"
                                            updateProperty={(key, value) => key === 'child' && setChildEq(value)}
                                            autocompleteHandler={WS.autocompleteEquipment}
                                        />
                                    </EAMBarcodeInput>

                                    <Button
                                        style={{ marginTop: 10 }}
                                        onClick={() => installEqpHandler(createEquipmentStructure(parentEq, childEq))}
                                        color="primary"
                                    >
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

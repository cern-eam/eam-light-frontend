import React, { useState, useEffect } from 'react';
import EISPanel from 'eam-components/ui/components/panel';
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMCheckbox from 'eam-components/ui/components/inputs-ng/EAMCheckbox'
import WSEquipment from "../../../../tools/WSEquipment";
import EISTable from 'eam-components/ui/components/table';

const ReplaceEqpHierarchy = (props) => {
    const {equipment, equipmentLayout, title} = props;

    const headers = ['Type', 'Equipment', 'Dependent', 'Cost Roll Up'];
    const propCodes = ['childTypeDesc', 'childCode', 'dependent', 'costRollUp'];
    const linksMap = new Map([['childCode', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]]);

    const [children, setChildren] = useState([]);

    useEffect(() => {
        //Fetch equipment children
        if (equipment) {
            WSEquipment.getEquipmentChildren(equipment.code).then(response => {
                setChildren(response.body.data);
            }).catch(error => {
                console.log(error); // TODO: should we be passing handleError as props and use it here instead?
            })
        }
    }, [equipment]);

    const renderAssetData = () => {
        if (!equipment.hierarchyAssetCode) {
            return <div/>;
        }
        return (
            <div>
                <EAMTextField elementInfo={{...equipmentLayout.fields['parentasset'], readonly: true}}
                          value={equipment.hierarchyAssetCode}
                          valueKey="hierarchyAssetCode"/>

                <EAMCheckbox
                    elementInfo={{...equipmentLayout.fields['dependentonparentasset'], readonly: true}}
                    value={equipment.hierarchyAssetDependent}
                    valueKey="hierarchyAssetDependent"/>

                <EAMCheckbox
                    elementInfo={{...equipmentLayout.fields['costrollupparentasset'], readonly: true}}
                    value={equipment.hierarchyAssetCostRollUp}
                    valueKey="hierarchyAssetCostRollUp"/>
            </div>);
    };

    const renderPositionData = () => {
        if (!equipment.hierarchyPositionCode) {
            return <div/>;
        }
        return (
            <div>
                <EAMTextField elementInfo={{...equipmentLayout.fields['position'], readonly: true}}
                          value={equipment.hierarchyPositionCode}
                          valueKey="hierarchyPositionCode"/>

                <EAMCheckbox elementInfo={{...equipmentLayout.fields['dependentonposition'], readonly: true}}
                             value={equipment.hierarchyPositionDependent}
                             valueKey="hierarchyPositionDependent"/>

                <EAMCheckbox elementInfo={{...equipmentLayout.fields['costrollupposition'], readonly: true}}
                             value={equipment.hierarchyPositionCostRollUp}
                             valueKey="hierarchyPositionCostRollUp"/>
            </div>);
    };

    const renderChildren = () => {
        if (children.length === 0) {
            return <div/>;
        }
        return (
            <div>
                <h4 style={{marginBottom: '-5px'}}>Children</h4>
                <EISTable data={children} headers={headers} propCodes={propCodes}
                          linksMap={linksMap}/>
            </div>
        );
    }

    if (!equipment) {
        return <div/>;
    }
    return (<EISPanel heading={title}>
            <div style={{width: "100%", marginTop: 0}}>
                {renderAssetData()}
                {renderPositionData()}

                {equipment.hierarchyLocationCode &&
                <EAMTextField elementInfo={{...equipmentLayout.fields['location'], readonly: true}}
                            value={equipment.hierarchyLocationCode}
                            valueKey="hierarchyLocationCode"/>
                }
                {renderChildren()}
            </div>
        </EISPanel>
    );
};


export default ReplaceEqpHierarchy;
import React, { useState, useEffect } from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import WSEquipment from "../../../../tools/WSEquipment";
import EISTable from 'eam-components/dist/ui/components/table';

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
                <EAMTextField 
                    {...processElementInfo(equipmentLayout.fields['parentasset'])}
                    disabled
                    value={equipment.hierarchyAssetCode}
                    valueKey="hierarchyAssetCode"
                />

                <EAMCheckbox
                    {...processElementInfo(equipmentLayout.fields['dependentonparentasset'])}
                    disabled
                    value={equipment.hierarchyAssetDependent}
                    valueKey="hierarchyAssetDependent"
                />

                <EAMCheckbox
                    {...processElementInfo(equipmentLayout.fields['costrollupparentasset'])}
                    disabled
                    value={equipment.hierarchyAssetCostRollUp}
                    valueKey="hierarchyAssetCostRollUp"
                />
            </div>);
    };

    const renderPositionData = () => {
        if (!equipment.hierarchyPositionCode) {
            return <div/>;
        }
        return (
            <div>
                <EAMTextField
                    {...processElementInfo(equipmentLayout.fields['position'])}
                    disabled
                    value={equipment.hierarchyPositionCode}
                    valueKey="hierarchyPositionCode"
                />

                <EAMCheckbox 
                    {...processElementInfo(equipmentLayout.fields['dependentonposition'])}
                    disabled
                    value={equipment.hierarchyPositionDependent}
                    valueKey="hierarchyPositionDependent"
                />

                <EAMCheckbox 
                    {...processElementInfo(equipmentLayout.fields['costrollupposition'])}
                    disabled
                    value={equipment.hierarchyPositionCostRollUp}
                    valueKey="hierarchyPositionCostRollUp"
                />
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
                    <EAMTextField
                        {...processElementInfo(equipmentLayout.fields['location'])}
                        disabled
                        value={equipment.hierarchyLocationCode}
                        valueKey="hierarchyLocationCode"
                    />
                }
                {renderChildren()}
            </div>
        </EISPanel>
    );
};


export default ReplaceEqpHierarchy;
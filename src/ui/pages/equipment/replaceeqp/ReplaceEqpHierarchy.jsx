import React, { useState, useEffect } from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import WSEquipment from "../../../../tools/WSEquipment";
import EISTable from 'eam-components/dist/ui/components/table';
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { getDependencyType, getParentAssetCode, getParentAssetCostRollUp, getParentPositionCode, ParentDependencyTypes } from '../asset/assethierarchytools';
import { get } from 'lodash';

const ReplaceEqpHierarchy = (props) => {
    const {equipment, equipmentLayout, title} = props;

    const headers = ['Type', 'Equipment', 'Dependent', 'Cost Roll Up'];
    const propCodes = ['childTypeDesc', 'childCode', 'dependent', 'costRollUp'];
    const linksMap = new Map([['childCode', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]]);
    const hierarchyKey = 'AssetParentHierarchy'
    const [children, setChildren] = useState([]);

    useEffect(() => {
        //Fetch equipment children
        if (equipment) {
            WSEquipment.getEquipmentChildren(equipment.ASSETID?.EQUIPMENTCODE ?? equipment.POSITIONID?.EQUIPMENTCODE).then(response => {
                setChildren(response.body.data);
            }).catch(error => {
                console.log(error); // TODO: should we be passing handleError as props and use it here instead?
            })
        }
    }, [equipment]);

    const renderAssetData = () => {
        if (!getParentAssetCode(hierarchyKey, equipment)) {
            return <div/>;
        }
        return (
            <div>
                <EAMTextField 
                    {...processElementInfo(equipmentLayout.fields['parentasset'])}
                    disabled
                    value={getParentAssetCode(hierarchyKey, equipment)}
                />

                <EAMCheckbox
                    {...processElementInfo(equipmentLayout.fields['dependentonparentasset'])}
                    disabled
                    value={getDependencyType(equipment[hierarchyKey]) === ParentDependencyTypes.ASSET}
                />

                <EAMCheckbox
                    {...processElementInfo(equipmentLayout.fields['costrollupparentasset'])}
                    disabled
                    value={getParentAssetCostRollUp(hierarchyKey, equipment)}
                />
            </div>);
    };

    const renderPositionData = () => {
        if (!getParentPositionCode(hierarchyKey, equipment)) {
            return <div/>;
        }
        return (
            <div>
                <EAMTextField
                    {...processElementInfo(equipmentLayout.fields['position'])}
                    disabled
                    value={getParentPositionCode(hierarchyKey, equipment)}
                />

                <EAMCheckbox 
                    {...processElementInfo(equipmentLayout.fields['dependentonposition'])}
                    disabled
                    value={getDependencyType(equipment[hierarchyKey]) === ParentDependencyTypes.POSITION}
                />

                <EAMCheckbox 
                    {...processElementInfo(equipmentLayout.fields['costrollupposition'])}
                    disabled
                    value={getParentPositionCode(hierarchyKey, equipment)}
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

                {get(equipment, 'AssetParentHierarchy.LOCATIONID.LOCATIONCODE') &&
                    <EAMTextField
                        {...processElementInfo(equipmentLayout.fields['location'])}
                        disabled
                        value={get(equipment, 'AssetParentHierarchy.LOCATIONID.LOCATIONCODE')}
                    />
                }
                {renderChildren()}
            </div>
        </EISPanel>
    );
};


export default ReplaceEqpHierarchy;
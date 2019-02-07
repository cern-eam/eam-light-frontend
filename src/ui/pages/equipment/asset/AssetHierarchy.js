import React, { Component } from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";

class AssetHierarchy extends Component {

    render() {
        let {equipment, children, assetLayout, updateEquipmentProperty} = this.props
        
        return (
            <EISPanel heading="HIERARCHY">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMInput
                        children = {children}
                        elementInfo={{...assetLayout.fields['udfchar13'],readonly:true}}
                        value={equipment.userDefinedFields.udfchar13}
                        updateProperty={updateEquipmentProperty}
                        valueKey="userDefinedFields.udfchar13"/>

                    <EAMInput
                        children = {children}
                        elementInfo={{...assetLayout.fields['udfchar11'],readonly:true}}
                        value={equipment.userDefinedFields.udfchar11}
                        updateProperty={updateEquipmentProperty}
                        valueKey="userDefinedFields.udfchar11"/>

                    <EAMAutocomplete
                        children = {children}
                        elementInfo={assetLayout.fields['parentasset']}
                        value={equipment.hierarchyAssetCode}
                        updateProperty={updateEquipmentProperty}
                        valueKey="hierarchyAssetCode"
                        valueDesc={equipment.hierarchyAssetDesc}
                        descKey="hierarchyAssetDesc"
                        autocompleteHandler={WSEquipment.autocompleteEquipmentParent}/>

                    <EAMAutocomplete
                        children = {children}
                        elementInfo={assetLayout.fields['position']}
                        value={equipment.hierarchyPositionCode}
                        updateProperty={updateEquipmentProperty}
                        valueKey="hierarchyPositionCode"
                        valueDesc={equipment.hierarchyPositionDesc}
                        descKey="hierarchyPositionDesc"
                        autocompleteHandler={WSEquipment.autocompleteEquipmentPosition}/>

                    <EAMAutocomplete
                        children = {children}
                        elementInfo={assetLayout.fields['primarysystem']}
                        value={equipment.hierarchyPrimarySystemCode}
                        updateProperty={updateEquipmentProperty}
                        valueKey="hierarchyPrimarySystemCode"
                        valueDesc={equipment.hierarchyPrimarySystemDesc}
                        descKey="hierarchyPrimarySystemDesc"
                        autocompleteHandler={WSEquipment.autocompletePrimarySystem}/>

                    <EAMAutocomplete
                        children = {children}
                        elementInfo={assetLayout.fields['location']}
                        value={equipment.hierarchyLocationCode}
                        updateProperty={updateEquipmentProperty}
                        valueKey="hierarchyLocationCode"
                        valueDesc={equipment.hierarchyLocationDesc}
                        descKey="hierarchyLocationDesc"
                        autocompleteHandler={WSEquipment.autocompleteLocation}/>

                </div>
            </EISPanel>
        )
    }
}

export default AssetHierarchy
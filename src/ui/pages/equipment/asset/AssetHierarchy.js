import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

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

                    <EAMBarcodeInput updateProperty={value => updateEquipmentProperty('hierarchyAssetCode', value)} right={0} top={20}>
                        <EAMAutocomplete
                            children = {children}
                            elementInfo={assetLayout.fields['parentasset']}
                            value={equipment.hierarchyAssetCode}
                            updateProperty={updateEquipmentProperty}
                            valueKey="hierarchyAssetCode"
                            valueDesc={equipment.hierarchyAssetDesc}
                            descKey="hierarchyAssetDesc"
                            autocompleteHandler={WSEquipment.autocompleteAssetParent}/>
                    </EAMBarcodeInput>

                    <EAMBarcodeInput updateProperty={value => updateEquipmentProperty('hierarchyPositionCode', value)} right={0} top={20}>
                        <EAMAutocomplete
                            children = {children}
                            elementInfo={assetLayout.fields['position']}
                            value={equipment.hierarchyPositionCode}
                            updateProperty={updateEquipmentProperty}
                            valueKey="hierarchyPositionCode"
                            valueDesc={equipment.hierarchyPositionDesc}
                            descKey="hierarchyPositionDesc"
                            autocompleteHandler={WSEquipment.autocompletePositionParent}/>
                    </EAMBarcodeInput>


                    <EAMBarcodeInput updateProperty={value => updateEquipmentProperty('hierarchyPrimarySystemCode', value)} right={0} top={20}>
                        <EAMAutocomplete
                            children = {children}
                            elementInfo={assetLayout.fields['primarysystem']}
                            value={equipment.hierarchyPrimarySystemCode}
                            updateProperty={updateEquipmentProperty}
                            valueKey="hierarchyPrimarySystemCode"
                            valueDesc={equipment.hierarchyPrimarySystemDesc}
                            descKey="hierarchyPrimarySystemDesc"
                            autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}/>
                    </EAMBarcodeInput>

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
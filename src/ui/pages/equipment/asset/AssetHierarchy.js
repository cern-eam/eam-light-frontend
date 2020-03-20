import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMCheckbox from 'eam-components/dist/ui/components/muiinputs/EAMCheckbox';

class AssetHierarchy extends Component {

    styles = {
        checkboxStyle: {
            display:"flex", 
            paddingLeft: "10px",
            marginRight:"-23px",
            marginBottom: "-20px",
            marginTop: "-10px"
        },
        labelStyle: {
            display:"flex", 
            alignItems:"center",
            padding:'0',
            marginBottom: "-20px",
            marginTop: "-10px"
        },
        dependencyRowStyle: {
            display: "flex", 
            flexDirection:"row-reverse", 
            fontSize:"10px", 
            width: '100%'
        },
        dependencyCheckboxWrapperStyle: {
            display: "flex", 
            flexDirection:"row",
        }
    }

    updateDependencyProperty = (key, value, equipment) => {
        let { updateEquipmentProperty } = this.props
        //inversed map of hierarchy properties. Asset Dependency has the highest priority.
        let hierarchyMap = {
            "hierarchyPrimarySystemCode": "hierarchyPrimarySystemDependent",
            "hierarchyPositionCode": "hierarchyPositionDependent",
            "hierarchyAssetCode": "hierarchyAssetDependent",
        }

        //prevent the update of the checkboxes when component updates the description
        if (Object.keys(hierarchyMap).includes(key)) {
            if (value && equipment) {
                //index of currently checked checkbox - if no value is present indexExistant = -1
                let indexExistant = Object.values(hierarchyMap).map(prop => equipment[prop])
                    .findIndex(value => value && value !== false.toString())
                //index of edited hierarchy field
                let indexAfter = Object.keys(hierarchyMap).findIndex(prop => prop === key)
                
                if (indexAfter > indexExistant) {
                    if(indexExistant !== -1){
                        Object.values(hierarchyMap).forEach(hierarchyProp => {
                            updateEquipmentProperty(hierarchyProp, false.toString());
                        })
                    }
                    updateEquipmentProperty(hierarchyMap[key], true.toString())
                }
            }else{
                updateEquipmentProperty(hierarchyMap[key], false.toString());
            }
        }
        
        updateEquipmentProperty(key, value)
    }

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
                                updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                                valueKey="hierarchyAssetCode"
                                valueDesc={equipment.hierarchyAssetDesc}
                                descKey="hierarchyAssetDesc"
                                autocompleteHandler={WSEquipment.autocompleteAssetParent}/>
                        </EAMBarcodeInput>

                        <div style={this.styles.dependencyRowStyle}>
                            <div style={this.styles.dependencyCheckboxWrapperStyle}>
                                <span style={this.styles.labelStyle}>Dependent</span>
                                <div style={this.styles.checkboxStyle}>
                                    <EAMCheckbox 
                                        elementInfo={{readonly: !equipment.hierarchyAssetCode}}
                                        children = {children}
                                        updateProperty={updateEquipmentProperty}
                                        value={equipment.hierarchyAssetDependent}
                                        valueKey="hierarchyAssetDependent"/> 
                                </div>
                            </div>
                        </div>

                    <EAMBarcodeInput updateProperty={value => updateEquipmentProperty('hierarchyPositionCode', value)} right={0} top={20}>
                        <EAMAutocomplete
                            children = {children}
                            elementInfo={assetLayout.fields['position']}
                            value={equipment.hierarchyPositionCode}
                            updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                            valueKey="hierarchyPositionCode"
                            valueDesc={equipment.hierarchyPositionDesc}
                            descKey="hierarchyPositionDesc"
                            autocompleteHandler={WSEquipment.autocompletePositionParent}/>
                    </EAMBarcodeInput>

                    <div style={this.styles.dependencyRowStyle}>
                        <div style={this.styles.dependencyCheckboxWrapperStyle}>
                            <span style={this.styles.labelStyle}>Dependent</span>
                            <div style={this.styles.checkboxStyle}>
                                <EAMCheckbox 
                                    elementInfo={{readonly: !equipment.hierarchyPositionCode}}
                                    children = {children}
                                    updateProperty={updateEquipmentProperty}
                                    value={equipment.hierarchyPositionDependent}
                                    valueKey="hierarchyPositionDependent"/> 
                            </div>
                        </div>
                    </div>

                    <EAMBarcodeInput updateProperty={value => updateEquipmentProperty('hierarchyPrimarySystemCode', value)} right={0} top={20}>
                        <EAMAutocomplete
                            children = {children}
                            elementInfo={assetLayout.fields['primarysystem']}
                            value={equipment.hierarchyPrimarySystemCode}
                            updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                            valueKey="hierarchyPrimarySystemCode"
                            valueDesc={equipment.hierarchyPrimarySystemDesc}
                            descKey="hierarchyPrimarySystemDesc"
                            autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}/>
                    </EAMBarcodeInput>

                    <div style={this.styles.dependencyRowStyle}>
                        <div style={this.styles.dependencyCheckboxWrapperStyle}>
                            <span style={this.styles.labelStyle}>Dependent</span>
                            <div style={this.styles.checkboxStyle}>
                                <EAMCheckbox 
                                            elementInfo={{readonly: !equipment.hierarchyPrimarySystemCode}}
                                            children = {children}
                                            updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPrimarySystemDependent}
                                            valueKey="hierarchyPrimarySystemDependent"/> 
                            </div>
                        </div>
                    </div>

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
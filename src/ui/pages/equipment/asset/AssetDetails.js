import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import OpenInAppIcon from 'mdi-material-ui/OpenInApp'
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

class AssetDetails extends Component {
    render() {
        let {equipment, children, assetLayout, updateEquipmentProperty, layout} = this.props;

        return (
            <React.Fragment>

                <EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['class']}
                    value={equipment.classCode}
                    desc={equipment.classDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="classCode"
                    descKey="classDesc"
                    autocompleteHandler={(filter) => WS.autocompleteClass('OBJ', filter)}/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['category']}
                    value={equipment.categoryCode}
                    desc={equipment.categoryDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="categoryCode"
                    descKey="categoryDesc"
                    autocompleteHandler={filter => WSEquipment.autocompleteEquipmentCategory(filter, equipment.classCode)}/>


                <EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['costcode']}
                    value={equipment.costCode}
                    desc={equipment.costCodeDesc || ""}
                    updateProperty={updateEquipmentProperty}
                    valueKey="costCode"
                    descKey="costCodeDesc"
                    autocompleteHandler={WSEquipment.autocompleteCostCode}/>

                <EAMDatePicker
                    children={children}
                    elementInfo={assetLayout.fields['commissiondate']}
                    value={equipment.comissionDate}
                    updateProperty={updateEquipmentProperty}
                    valueKey="comissionDate"/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['assignedto']}
                                    value={equipment.assignedTo}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="assignedTo"
                                    desc={equipment.assignedToDesc}
                                    descKey="assignedToDesc"
                                    autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                    children={children}
                    elementInfo={assetLayout.fields['criticality']}
                    value={equipment.criticality}
                    options={layout.criticalityValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="criticality"/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['manufacturer']}
                                    value={equipment.manufacturerCode}
                                    desc={equipment.manufacturerDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="manufacturerCode"
                                    descKey="manufacturerDesc"
                                    autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

                <EAMTextField
                    children={children}
                    elementInfo={assetLayout.fields['serialnumber']}
                    value={equipment.serialNumber}
                    updateProperty={updateEquipmentProperty}
                    valueKey="serialNumber"/>

                <EAMTextField
                    children={children}
                    elementInfo={assetLayout.fields['model']}
                    value={equipment.model}
                    updateProperty={updateEquipmentProperty}
                    valueKey="model"
                    inputProps={{maxLength: 30}}/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['part']}
                                    value={equipment.partCode}
                                    desc={equipment.partDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="partCode"
                                    descKey="partDesc"
                                    autocompleteHandler={WSEquipment.autocompleteEquipmentPart}
                                    link={() => equipment.partCode ? "/part/" + equipment.partCode: null}
                                    />

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['store']}
                                    value={equipment.storeCode}
                                    desc={equipment.storeDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="storeCode"
                                    descKey="storeDesc"
                                    autocompleteHandler={WSEquipment.autocompleteEquipmentStore}/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['bin']}
                                    value={equipment.bin}
                                    valueDesc={equipment.binDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="bin"
                                    descKey="binDesc"
                                    autocompleteHandler={(filter, config) => WSEquipment.autocompleteEquipmentBin(this.props.equipment.storeCode, filter, config)}/>

            </React.Fragment>
        )
    }
}

export default AssetDetails
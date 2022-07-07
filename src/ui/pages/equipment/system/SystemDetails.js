import React, {Component} from 'react';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/ui/components/inputs-ng/EAMDatePicker.js'
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import WSEquipment from "../../../../tools/WSEquipment";

class SystemDetails extends Component {
    render() {
        let {equipment, children, systemLayout, updateEquipmentProperty, layout} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                <EAMAutocomplete
                    children={children}
                    elementInfo={systemLayout.fields['class']}
                    value={equipment.classCode}
                    desc={equipment.classDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="classCode"
                    descKey="classDesc"
                    autocompleteHandler={(filter, config) => WS.autocompleteClass('OBJ', filter, config)}
                />

                <EAMAutocomplete
                    children={children}
                    elementInfo={systemLayout.fields['category']}
                    value={equipment.categoryCode}
                    desc={equipment.categoryDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="categoryCode"
                    descKey="categoryDesc"
                    autocompleteHandler={filter => WSEquipment.autocompleteEquipmentCategory(filter, equipment.classCode)}/>

                <EAMDatePicker
                    children={children}
                    elementInfo={systemLayout.fields['commissiondate']}
                    value={equipment.comissionDate}
                    updateProperty={updateEquipmentProperty}
                    valueKey="comissionDate"/>

                <EAMAutocomplete children={children}
                                    elementInfo={systemLayout.fields['assignedto']}
                                    value={equipment.assignedTo}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="assignedTo"
                                    desc={equipment.assignedToDesc}
                                    descKey="assignedToDesc"
                                    autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                    children={children}
                    elementInfo={systemLayout.fields['criticality']}
                    value={equipment.criticality}
                    options={layout.criticalityValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="criticality"/>

                <EAMAutocomplete children={children}
                                    elementInfo={systemLayout.fields['manufacturer']}
                                    updateProperty={updateEquipmentProperty}
                                    value={equipment.manufacturerCode}
                                    valueKey="manufacturerCode"
                                    desc={equipment.manufacturerDesc}
                                    descKey="manufacturerDesc"
                                    autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

                <EAMTextField
                    children={children}
                    elementInfo={systemLayout.fields['serialnumber']}
                    value={equipment.serialNumber}
                    updateProperty={updateEquipmentProperty}
                    valueKey="serialNumber"/>

                <EAMTextField
                    children={children}
                    elementInfo={systemLayout.fields['model']}
                    value={equipment.model}
                    updateProperty={updateEquipmentProperty}
                    valueKey="model"/>

            </div>
        )
    }
}

export default SystemDetails;
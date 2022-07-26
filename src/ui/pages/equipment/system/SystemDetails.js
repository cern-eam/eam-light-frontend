import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker.js'
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import WSEquipment from "../../../../tools/WSEquipment";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class SystemDetails extends Component {
    render() {
        let {equipment, systemLayout, updateEquipmentProperty, layout} = this.props;

        return (
            <React.Fragment>

                <EAMAutocomplete
                    {...processElementInfo(systemLayout.fields['class'])}
                    value={equipment.classCode}
                    desc={equipment.classDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="classCode"
                    descKey="classDesc"
                    autocompleteHandler={(filter, config) => WS.autocompleteClass('OBJ', filter, config)}
                />

                <EAMAutocomplete
                    {...processElementInfo(systemLayout.fields['category'])}
                    value={equipment.categoryCode}
                    desc={equipment.categoryDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="categoryCode"
                    descKey="categoryDesc"
                    autocompleteHandler={filter => WSEquipment.autocompleteEquipmentCategory(filter, equipment.classCode)}/>

                <EAMDatePicker
                    {...processElementInfo(systemLayout.fields['commissiondate'])}
                    value={equipment.comissionDate}
                    updateProperty={updateEquipmentProperty}
                    valueKey="comissionDate"/>

                <EAMAutocomplete {...processElementInfo(systemLayout.fields['assignedto'])}
                                    value={equipment.assignedTo}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="assignedTo"
                                    desc={equipment.assignedToDesc}
                                    descKey="assignedToDesc"
                                    autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                    {...processElementInfo(systemLayout.fields['criticality'])}
                    value={equipment.criticality}
                    options={layout.criticalityValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="criticality"/>

                <EAMAutocomplete {...processElementInfo(systemLayout.fields['manufacturer'])}
                                    updateProperty={updateEquipmentProperty}
                                    value={equipment.manufacturerCode}
                                    valueKey="manufacturerCode"
                                    desc={equipment.manufacturerDesc}
                                    descKey="manufacturerDesc"
                                    autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['serialnumber'])}
                    value={equipment.serialNumber}
                    updateProperty={updateEquipmentProperty}
                    valueKey="serialNumber"/>

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['model'])}
                    value={equipment.model}
                    updateProperty={updateEquipmentProperty}
                    valueKey="model"/>

            </React.Fragment>
        )
    }
}

export default SystemDetails;
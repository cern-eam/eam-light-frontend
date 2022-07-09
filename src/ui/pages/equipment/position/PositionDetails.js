import React, {Component} from 'react';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/ui/components/inputs-ng/EAMDatePicker'
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import WSEquipment from "../../../../tools/WSEquipment";

class PositionDetails extends Component {
    render() {
        let {equipment, children, positionLayout, updateEquipmentProperty, layout} = this.props;

        return (
            <React.Fragment>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['class']}
                    value={equipment.classCode}
                    desc={equipment.classDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="classCode"
                    descKey="classDesc"
                    autocompleteHandler={(filter, config) => WS.autocompleteClass('OBJ', filter, config)}/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['category']}
                    value={equipment.categoryCode}
                    desc={equipment.categoryDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="categoryCode"
                    descKey="categoryDesc"
                    autocompleteHandler={filter => WSEquipment.autocompleteEquipmentCategory(filter, equipment.classCode)}/>

                <EAMDatePicker
                    children={children}
                    elementInfo={positionLayout.fields['commissiondate']}
                    value={equipment.comissionDate}
                    updateProperty={updateEquipmentProperty}
                    valueKey="comissionDate"/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['assignedto']}
                    value={equipment.assignedTo}
                    updateProperty={updateEquipmentProperty}
                    valueKey="assignedTo"
                    desc={equipment.assignedToDesc}
                    descKey="assignedToDesc"
                    autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                    children={children}
                    elementInfo={positionLayout.fields['criticality']}
                    value={equipment.criticality}
                    options={layout.criticalityValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="criticality"/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['manufacturer']}
                    updateProperty={updateEquipmentProperty}
                    value={equipment.manufacturerCode}
                    valueKey="manufacturerCode"
                    desc={equipment.manufacturerDesc}
                    descKey="manufacturerDesc"
                    autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

                <EAMTextField
                    children={children}
                    elementInfo={positionLayout.fields['serialnumber']}
                    value={equipment.serialNumber}
                    updateProperty={updateEquipmentProperty}
                    valueKey="serialNumber"/>

                <EAMTextField
                    children={children}
                    elementInfo={positionLayout.fields['model']}
                    value={equipment.model}
                    updateProperty={updateEquipmentProperty}
                    valueKey="model"/>

            </React.Fragment>
        )
    }
}

export default PositionDetails
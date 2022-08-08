import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import WSEquipment from "../../../../tools/WSEquipment";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import { onCategoryChange } from '../EquipmentTools';

const PositionDetails = (props) => {

    const { equipment, positionLayout, updateEquipmentProperty } = props;

    return (
        <React.Fragment>

            <EAMAutocomplete
                {...processElementInfo(positionLayout.fields['class'])}
                value={equipment.classCode}
                desc={equipment.classDesc}
                updateProperty={updateEquipmentProperty}
                valueKey="classCode"
                descKey="classDesc"
                autocompleteHandler={WS.autocompleteClass}
                autocompleteHandlerParams={['OBJ']}
            />

            <EAMAutocomplete
                {...processElementInfo(positionLayout.fields['category'])}
                value={equipment.categoryCode}
                desc={equipment.categoryDesc}
                updateProperty={updateEquipmentProperty}
                valueKey="categoryCode"
                descKey="categoryDesc"
                autocompleteHandler={WSEquipment.autocompleteEquipmentCategory}
                autocompleteHandlerParams={[equipment.classCode]}
                onChangeValue={(categoryCode) =>
                    onCategoryChange(categoryCode, updateEquipmentProperty)
                }
            />

            <EAMDatePicker
                {...processElementInfo(positionLayout.fields['commissiondate'])}
                value={equipment.comissionDate}
                updateProperty={updateEquipmentProperty}
                valueKey="comissionDate"/>

            <EAMAutocomplete
                {...processElementInfo(positionLayout.fields['assignedto'])}
                value={equipment.assignedTo}
                updateProperty={updateEquipmentProperty}
                valueKey="assignedTo"
                desc={equipment.assignedToDesc}
                descKey="assignedToDesc"
                autocompleteHandler={WS.autocompleteEmployee}/>

            <EAMSelect
                {...processElementInfo(positionLayout.fields['criticality'])}
                value={equipment.criticality}
                autocompleteHandler={WSEquipment.getEquipmentCriticalityValues}
                updateProperty={updateEquipmentProperty}
                valueKey="criticality"/>

            <EAMAutocomplete
                {...processElementInfo(positionLayout.fields['manufacturer'])}
                updateProperty={updateEquipmentProperty}
                value={equipment.manufacturerCode}
                valueKey="manufacturerCode"
                desc={equipment.manufacturerDesc}
                descKey="manufacturerDesc"
                autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

            <EAMTextField
                {...processElementInfo(positionLayout.fields['serialnumber'])}
                value={equipment.serialNumber}
                updateProperty={updateEquipmentProperty}
                valueKey="serialNumber"/>

            <EAMTextField
                {...processElementInfo(positionLayout.fields['model'])}
                value={equipment.model}
                updateProperty={updateEquipmentProperty}
                valueKey="model"/>

        </React.Fragment>
    )
}

export default PositionDetails
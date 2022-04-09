import React, {Component} from 'react';
import EAMSelect from 'eam-components/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import EquipmentTools from '../EquipmentTools';

class PositionGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let {equipment, children, positionLayout, updateEquipmentProperty, layout} = this.props
        
        return (
            <div style={{width: "100%", marginTop: 0}}>

                {layout.newEntity &&
                <EAMInput
                    children = {children}
                    elementInfo={positionLayout.fields['equipmentno']}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMInput
                    children = {children}
                    elementInfo={positionLayout.fields['alias']}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"/>

                <EAMInput
                    children = {children}
                    elementInfo={positionLayout.fields['udfchar45']}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMInput
                    children = {children}
                    elementInfo={positionLayout.fields['equipmentdesc']}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    children = {children}
                    elementInfo={positionLayout.fields['department']}
                    value={equipment.departmentCode}
                    valueDesc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    children = {children}
                    elementInfo={positionLayout.fields['assetstatus']}
                    value={equipment.statusCode}
                    values={layout.statusValues}
                    updateProperty={this.updateEquipmentStatus}
                    valueKey="statusCode"/>

                <StatusRow
                    entity={equipment}
                    entityType={"equipment"}
                    style={{marginTop: "10px", marginBottom: "-10px"}}
                />
            </div>
        )
    }
}

export default PositionGeneral
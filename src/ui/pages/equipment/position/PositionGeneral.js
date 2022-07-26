import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import EquipmentTools from '../EquipmentTools';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class PositionGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let {equipment, positionLayout, updateEquipmentProperty, layout} = this.props
        
        return (
            <React.Fragment>

                {layout.newEntity &&
                <EAMTextField
                    {...processElementInfo(positionLayout.fields['equipmentno'])}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMTextField
                    {...processElementInfo(positionLayout.fields['alias'])}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"/>

                <EAMTextField
                    {...processElementInfo(positionLayout.fields['udfchar45'])}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMTextField
                    {...processElementInfo(positionLayout.fields['equipmentdesc'])}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    {...processElementInfo(positionLayout.fields['department'])}
                    value={equipment.departmentCode}
                    desc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    {...processElementInfo(positionLayout.fields['assetstatus'])}
                    value={equipment.statusCode}
                    options={layout.statusValues}
                    updateProperty={this.updateEquipmentStatus}
                    valueKey="statusCode"/>

                <StatusRow
                    entity={equipment}
                    entityType={"equipment"}
                    style={{marginTop: "10px", marginBottom: "-10px"}}
                />
            </React.Fragment>
        )
    }
}

export default PositionGeneral
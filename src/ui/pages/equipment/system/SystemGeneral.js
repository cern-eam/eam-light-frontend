import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow";
import EquipmentTools from "../EquipmentTools"
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class SystemGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let {equipment, systemLayout, updateEquipmentProperty, newEntity, userGroup} = this.props;

        return (
            <React.Fragment>

                {newEntity &&
                <EAMTextField
                    {...processElementInfo(systemLayout.fields['equipmentno'])}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['alias'])}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"/>

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['udfchar45'])}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['equipmentdesc'])}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    {...processElementInfo(systemLayout.fields['department'])}
                    value={equipment.departmentCode}
                    desc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    {...processElementInfo(systemLayout.fields['assetstatus'])}
                    value={equipment.statusCode}
                    autocompleteHandler={WSEquipment.getEquipmentStatusValues}
                    autocompleteHandlerParams={[userGroup, newEntity, equipment.statusCode]}
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

export default SystemGeneral;
import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import CERNMode from "../../../components/CERNMode"
import EquipmentTools from "../EquipmentTools"

class AssetGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let { equipment, children, assetLayout, updateEquipmentProperty, layout } = this.props

        return (
            <div style={{width: "100%", marginTop: 0}}>

                {layout.newEntity &&
                <EAMInput
                    children = {children}
                    elementInfo={assetLayout.fields['equipmentno']}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMInput
                    children = {children}
                    elementInfo={assetLayout.fields['alias']}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"
                />

                <EAMInput
                    children = {children}
                    elementInfo={assetLayout.fields['udfchar45']}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMInput
                    children = {children}
                    elementInfo={assetLayout.fields['equipmentdesc']}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    children = {children}
                    elementInfo={assetLayout.fields['department']}
                    value={equipment.departmentCode}
                    valueDesc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    children = {children}
                    elementInfo={assetLayout.fields['assetstatus']}
                    value={equipment.statusCode}
                    values={layout.statusValues}
                    updateProperty={this.updateEquipmentStatus}
                    valueKey="statusCode"/>
                
                <EAMSelect
                    children={children}
                    elementInfo={assetLayout.fields['state']}
                    value={equipment.stateCode}
                    values={layout.stateValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="stateCode"/>

                <StatusRow
                    entity={equipment}
                    entityType={"equipment"}
                    style={{marginTop: "10px", marginBottom: "-10px"}}
                />
            </div>
        )
    }
}

export default AssetGeneral
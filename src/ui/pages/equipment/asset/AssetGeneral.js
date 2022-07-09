import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import CERNMode from "../../../components/CERNMode"
import EquipmentTools from "../EquipmentTools"
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMUDF from 'eam-components/ui/components/inputs-ng/EAMUDF';
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import WSUDF from "tools/WSUDF";

class AssetGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let { equipment, children, assetLayout, updateEquipmentProperty, layout } = this.props

        return (
            <React.Fragment>

                {layout.newEntity &&
                <EAMTextField
                    children = {children}
                    elementInfo={assetLayout.fields['equipmentno']}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMTextField
                    children = {children}
                    elementInfo={assetLayout.fields['alias']}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"
                />

                <EAMUDF
                    children = {children}
                    elementInfo={assetLayout.fields['udfchar45']}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMTextField
                    children = {children}
                    elementInfo={assetLayout.fields['equipmentdesc']}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    children = {children}
                    elementInfo={assetLayout.fields['department']}
                    value={equipment.departmentCode}
                    desc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    children = {children}
                    elementInfo={assetLayout.fields['assetstatus']}
                    value={equipment.statusCode}
                    options={layout.statusValues}
                    updateProperty={this.updateEquipmentStatus}
                    valueKey="statusCode"/>
                
                <EAMSelect
                    children={children}
                    elementInfo={assetLayout.fields['state']}
                    value={equipment.stateCode}
                    options={layout.stateValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="stateCode"/>

                <StatusRow
                    entity={equipment}
                    entityType={"equipment"}
                    style={{marginTop: "10px", marginBottom: "-10px"}}
                />
            </React.Fragment>
        )
    }
}

export default AssetGeneral
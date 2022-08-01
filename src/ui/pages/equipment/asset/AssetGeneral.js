import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import CERNMode from "../../../components/CERNMode"
import EquipmentTools from "../EquipmentTools"
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMUDF from 'eam-components/dist/ui/components/inputs-ng/EAMUDF';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import WSUDF from "tools/WSUDF";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class AssetGeneral extends Component {

    updateEquipmentStatus = EquipmentTools.getUpdateStatus(this.props.updateEquipmentProperty, this.props.showNotification);

    render() {
        let { equipment, assetLayout, updateEquipmentProperty, newEntity, userGroup } = this.props

        return (
            <React.Fragment>

                {newEntity &&
                <EAMTextField
                    {...processElementInfo(assetLayout.fields['equipmentno'])}
                    value={equipment.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"/>}

                <EAMTextField
                    {...processElementInfo(assetLayout.fields['alias'])}
                    value={equipment.alias}
                    updateProperty={updateEquipmentProperty}
                    valueKey="alias"
                />

                <EAMUDF
                    elementInfo={assetLayout.fields['udfchar45']}
                    value={equipment.userDefinedFields.udfchar45}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar45"
                />

                <EAMTextField
                    {...processElementInfo(assetLayout.fields['equipmentdesc'])}
                    value={equipment.description}
                    updateProperty={updateEquipmentProperty}
                    valueKey="description"/>

                <EAMAutocomplete
                    {...processElementInfo(assetLayout.fields['department'])}
                    value={equipment.departmentCode}
                    desc={equipment.departmentDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="departmentCode"
                    descKey="departmentDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}/>

                <EAMSelect
                    {...processElementInfo(assetLayout.fields['assetstatus'])}
                    value={equipment.statusCode}
                    autocompleteHandler={WSEquipment.getEquipmentStatusValues}
                    autocompleteHandlerParams={[userGroup, newEntity, equipment.statusCode]}
                    updateProperty={this.updateEquipmentStatus}
                    valueKey="statusCode"/>
                
                <EAMSelect
                    {...processElementInfo(assetLayout.fields['state'])}
                    value={equipment.stateCode}
                    autocompleteHandler={WSEquipment.getEquipmentStateValues}
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
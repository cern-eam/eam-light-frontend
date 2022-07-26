import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class SystemHierarchy extends Component {

    render() {
        let {equipment, systemLayout, updateEquipmentProperty} = this.props;

        return (
            <React.Fragment>

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['udfchar13'])}
                    readonly={true}
                    value={equipment.userDefinedFields.udfchar13}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar13"/>

                <EAMTextField
                    {...processElementInfo(systemLayout.fields['udfchar11'])}
                    readonly={true}
                    value={equipment.userDefinedFields.udfchar11}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar11"/>

                <EAMAutocomplete
                    {...processElementInfo(systemLayout.fields['primarysystem'])}
                    value={equipment.hierarchyPrimarySystemCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyPrimarySystemCode"
                    desc={equipment.hierarchyPrimarySystemDesc}
                    descKey="hierarchyPrimarySystemDesc"
                    autocompleteHandler={WSEquipment.autocompletePrimarySystem}/>

                <EAMAutocomplete
                    {...processElementInfo(systemLayout.fields['location'])}
                    value={equipment.hierarchyLocationCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyLocationCode"
                    desc={equipment.hierarchyLocationDesc}
                    descKey="hierarchyLocationDesc"
                    autocompleteHandler={WSEquipment.autocompleteLocation}/>

            </React.Fragment>
        )
    }
}

export default SystemHierarchy;
import React, {Component} from 'react';
import EAMInput from 'eam-components/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";

class SystemHierarchy extends Component {

    render() {
        let {equipment, children, systemLayout, updateEquipmentProperty} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                <EAMInput
                    children={children}
                    elementInfo={{...systemLayout.fields['udfchar13'], readonly: true}}
                    value={equipment.userDefinedFields.udfchar13}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar13"/>

                <EAMInput
                    children={children}
                    elementInfo={{...systemLayout.fields['udfchar11'], readonly: true}}
                    value={equipment.userDefinedFields.udfchar11}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar11"/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={systemLayout.fields['primarysystem']}
                    value={equipment.hierarchyPrimarySystemCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyPrimarySystemCode"
                    valueDesc={equipment.hierarchyPrimarySystemDesc}
                    descKey="hierarchyPrimarySystemDesc"
                    autocompleteHandler={WSEquipment.autocompletePrimarySystem}/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={systemLayout.fields['location']}
                    value={equipment.hierarchyLocationCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyLocationCode"
                    valueDesc={equipment.hierarchyLocationDesc}
                    descKey="hierarchyLocationDesc"
                    autocompleteHandler={WSEquipment.autocompleteLocation}/>

            </div>
        )
    }
}

export default SystemHierarchy;
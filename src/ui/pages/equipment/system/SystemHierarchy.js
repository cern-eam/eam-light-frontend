import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";

class SystemHierarchy extends Component {

    render() {
        let { register } = this.props;

        return (
            <React.Fragment>

                <EAMTextField
                    {...register('udfchar13', 'userDefinedFields.udfchar13')}
                    readonly={true}
                />

                <EAMTextField
                    {...register('udfchar11', 'userDefinedFields.udfchar11')}
                    readonly={true}
                />

                <EAMAutocomplete
                    {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc')}
                    autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                    // autocompleteHandler={WSEquipment.autocompletePrimarySystem} // TODO: this WS function was not defined, so I changed it to the closest that existed in name: 'autocompletePrimarySystemParent'?
                />

                <EAMAutocomplete
                    {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                    autocompleteHandler={WSEquipment.autocompleteLocation}
                />

            </React.Fragment>
        )
    }
}

export default SystemHierarchy;

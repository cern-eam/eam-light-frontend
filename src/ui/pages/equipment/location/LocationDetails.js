import React from "react";
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMCheckbox from 'eam-components/ui/components/inputs-ng/EAMCheckbox'
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";

const LocationDetails = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;

    return (
        <React.Fragment>
            <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["class"]}
                value={location.classCode}
                desc={location.classDesc}
                valueKey="classCode"
                descKey="classDesc"
                updateProperty={updateEquipmentProperty}
                autocompleteHandler={filter =>
                    WS.autocompleteClass("LOC", filter)
                }
            />

            <EAMTextField
                children={children}
                elementInfo={locationLayout.fields["costcode"]}
                value={location.costCode}
                valueKey="costCode"
                updateProperty={updateEquipmentProperty}
            />

            <EAMCheckbox
                children={children}
                elementInfo={locationLayout.fields["safety"]}
                value={`${location.safety}`}
                updateProperty={updateEquipmentProperty}
                valueKey="safety"
            />

            <EAMCheckbox
                children={children}
                elementInfo={locationLayout.fields["outofservice"]}
                value={`${location.outOfService}`}
                updateProperty={updateEquipmentProperty}
                valueKey="outOfService"
            />
        </React.Fragment>
    );
};

export default LocationDetails;

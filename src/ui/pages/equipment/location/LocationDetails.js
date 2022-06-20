import React from "react";
import EAMInput from "eam-components/ui/components/muiinputs/EAMInput";
import EAMCheckbox from "eam-components/ui/components/muiinputs/EAMCheckbox";
import EAMAutocomplete from "eam-components/ui/components/muiinputs/EAMAutocomplete";
import WS from "../../../../tools/WS";

const LocationDetails = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;

    return (
        <div style={{ width: "100%", marginTop: 0 }}>
            <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["class"]}
                value={location.classCode}
                valueDesc={location.classDesc}
                valueKey="classCode"
                descKey="classDesc"
                updateProperty={updateEquipmentProperty}
                autocompleteHandler={filter =>
                    WS.autocompleteClass("LOC", filter)
                }
            />

            <EAMInput
                children={children}
                elementInfo={locationLayout.fields["costcode"]}
                value={location.costCode}
                updatePropert
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
        </div>
    );
};

export default LocationDetails;

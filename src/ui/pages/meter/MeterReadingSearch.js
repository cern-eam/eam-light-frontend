import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSMeters from "../../../tools/WSMeters";

class MeterReadingSearch extends React.Component {

    render() {
        const {parentProps} = this.props;
        const {searchCriteria} = parentProps;    

        const idPrefix = "EAMID_MeterReadingSearch_";

        return (
            <EISPanel heading="SEARCH PANEL" alwaysExpanded={true}>
                <div style={{width: "100%", marginTop: 0}}>
                    <EAMAutocomplete
                        label={"Meter Code"}
                        value={searchCriteria.meterCode}
                        updateProperty={parentProps.updateSearchProperty}
                        valueKey="meterCode"
                        autocompleteHandler={WSMeters.autocompleteMeterCode}
                        onChange={parentProps.onChangeMeterCode}
                        desc={searchCriteria.meterDesc}
                        descKey="meterDesc"
                        barcodeScanner
                        id={`${idPrefix}METERCODE`}
                    />
                    <EAMAutocomplete
                        label={"Equipment Code"}
                        value={searchCriteria.equipmentCode}
                        updateProperty={parentProps.updateSearchProperty}
                        valueKey="equipmentCode"
                        autocompleteHandler={WSMeters.autocompleteMeterEquipment}
                        onChange={parentProps.onChangeEquipmentCode}
                        desc={searchCriteria.equipmentDesc}
                        descKey="equipmentDesc"
                        barcodeScanner
                        id={`${idPrefix}EQUIPMENTCODE`}
                    />
                </div>
            </EISPanel>
        );
    }
}

export default MeterReadingSearch;
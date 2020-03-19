import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSMeters from "../../../tools/WSMeters";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";



class MeterReadingSearch extends React.Component {


    render() {
        const {parentProps} = this.props;
        const {searchCriteria} = parentProps;    

        return (
            <EISPanel heading="SEARCH PANEL" alwaysExpanded={true}>
                <div style={{width: "100%", marginTop: 0}}>
                    <EAMBarcodeInput updateProperty={value => parentProps.updateSearchProperty('meterCode', value)} top={3} right={-7}>
                        <EAMAutocomplete elementInfo={{attribute: "O", text: "Meter Code"}}
                                     value={searchCriteria.meterCode}
                                     updateProperty={parentProps.updateSearchProperty}
                                     valueKey="meterCode"
                                     autocompleteHandler={WSMeters.autocompleteMeterCode}
                                     onChangeValue={parentProps.onChangeMeterCode}
                                     valueDesc={searchCriteria.meterDesc}
                                     descKey="meterDesc"/>
                    </EAMBarcodeInput>
                    <EAMBarcodeInput updateProperty={value => parentProps.updateSearchProperty('equipmentCode', value)} top={3} right={-7}>
                        <EAMAutocomplete elementInfo={{attribute: "O", text: "Equipment Code"}}
                                     value={searchCriteria.equipmentCode}
                                     updateProperty={parentProps.updateSearchProperty}
                                     valueKey="equipmentCode"
                                     autocompleteHandler={WSMeters.autocompleteMeterEquipment}
                                     onChangeValue={parentProps.onChangeEquipmentCode}
                                     valueDesc={searchCriteria.equipmentDesc}
                                     descKey="equipmentDesc"/>
                    </EAMBarcodeInput>                   

                </div>
            </EISPanel>
        );
    }
}

export default MeterReadingSearch;
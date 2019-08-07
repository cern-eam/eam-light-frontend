import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMCheckbox from 'eam-components/dist/ui/components/muiinputs/EAMCheckbox'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WS from "../../../tools/WS";
import WSWorkorders from "../../../tools/WSWorkorders";
import UDFChar from "../../components/userdefinedfields/UDFChar";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

class WorkorderDetails extends Component {

    onChangeEquipment = (value) => {
        const {updateWorkorderProperty, setWOEquipment} = this.props;
        //If there is a value, fetch location, department, cost code
        //and custom fields
        if (value) {
            WSWorkorders.autocompleteWorkorderEquipmentSelected(value).then(response => {
                const data = response.body.data;
                //Assign values
                updateWorkorderProperty('departmentCode', data[2]);
                updateWorkorderProperty('departmentDesc', data[3]);
                updateWorkorderProperty('locationCode', data[4]);
                updateWorkorderProperty('locationDesc', data[5]);
                updateWorkorderProperty('costCode', data[6]);
                updateWorkorderProperty('costCodeDesc', '');
                //Set the equipment work order
                setWOEquipment(value);
            }).catch(error => {
                //Simply don't assign values
            });
        }
    };

    render() {
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;

        return (
            <EISPanel heading="GENERAL">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['description']}
                        value={workorder.description}
                        updateProperty={updateWorkorderProperty}
                        valueKey="description"/>

                        <EAMBarcodeInput updateProperty={value => updateWorkorderProperty('equipmentCode', value)} right={30} top={20}>
                            <EAMAutocomplete children={children}
                                             elementInfo={workOrderLayout.fields['equipment']}
                                             value={workorder.equipmentCode}
                                             valueKey="equipmentCode"
                                             valueDesc={workorder.equipmentDesc}
                                             descKey="equipmentDesc"
                                             updateProperty={updateWorkorderProperty}
                                             autocompleteHandler={WSWorkorders.autocompleteWorkorderEquipment}
                                             onChangeValue={this.onChangeEquipment}
                                             link={() => workorder.equipmentCode ? "/equipment/" + workorder.equipmentCode : null}
                            />
                        </EAMBarcodeInput>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['location']}
                                     value={workorder.locationCode}
                                     valueKey="locationCode"
                                     valueDesc={workorder.locationDesc}
                                     descKey="locationDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteLocation}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['department']}
                                     value={workorder.departmentCode}
                                     valueKey="departmentCode"
                                     valueDesc={workorder.departmentDesc}
                                     descKey="departmentDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteDepartment}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['workordertype']}
                        valueKey="typeCode"
                        values={layout.typeValues}
                        value={workorder.typeCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['workorderstatus']}
                        valueKey="statusCode"
                        values={layout.statusValues}
                        value={workorder.statusCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['priority']}
                        valueKey="priorityCode"
                        values={layout.priorityValues}
                        value={workorder.priorityCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['woclass']}
                                     value={workorder.classCode}
                                     valueKey="classCode"
                                     valueDesc={workorder.classDesc}
                                     descKey="classDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={(filter, config) => WS.autocompleteClass('EVNT', filter, config)}/>

                    <EAMInput
                        elementInfo={{...workOrderLayout.fields['parentwo'], readonly: true}}
                        value={workorder.parentWO}
                        updateProperty={updateWorkorderProperty}
                        valueKey="parentWO"/>

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar01']}
                             fieldValue={workorder.userDefinedFields.udfchar01}
                             fieldValueDesc={workorder.userDefinedFields.udfchar01Desc}
                             fieldKey={`userDefinedFields.udfchar01`}
                             descKey={`userDefinedFields.udfchar01Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}
                             link={() => workorder.userDefinedFields.udfchar01 ? "https://cern.service-now.com/task.do?sysparm_query=number=" + workorder.userDefinedFields.udfchar01 : null}
                    />

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar20']}
                             fieldValue={workorder.userDefinedFields.udfchar20}
                             fieldValueDesc={workorder.userDefinedFields.udfchar20Desc}
                             fieldKey={`userDefinedFields.udfchar20`}
                             descKey={`userDefinedFields.udfchar20Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>

                    <EAMCheckbox elementInfo={workOrderLayout.fields['udfchkbox02']}
                                 value={workorder.userDefinedFields.udfchkbox02}
                                 updateProperty={updateWorkorderProperty}
                                 valueKey={`userDefinedFields.udfchkbox02`}
                                 children={children}/>

                    <EAMCheckbox elementInfo={workOrderLayout.fields['udfchkbox04']}
                                 value={workorder.userDefinedFields.udfchkbox04}
                                 updateProperty={updateWorkorderProperty}
                                 valueKey={`userDefinedFields.udfchkbox04`}
                                 children={children}/>

                </div>
            </EISPanel>
        )
    }
}

export default WorkorderDetails
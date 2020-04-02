import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMCheckbox from 'eam-components/dist/ui/components/muiinputs/EAMCheckbox'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WS from '../../../tools/WS'
import UDFChar from "../../components/userdefinedfields/UDFChar";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

function WorkorderDetails(props) {

    const { children, workOrderLayout, workorder, updateWorkorderProperty, layout, applicationData, setWOEquipment, userData } = props;
    const rpawClassesList = (applicationData && applicationData.EL_TRPAC && applicationData.EL_TRPAC.split(',')) || [];
    const rpawLink = applicationData && applicationData.EL_TRPAW;

    let onChangeEquipment = (value) => {
        //If there is a value, fetch location, department, cost code
        //and custom fields
        if (value) {
            WS.autocompleteEquipmentSelected(value).then(response => {
                const data = response.body.data[0];
                //Assign values
                updateWorkorderProperty('departmentCode', data.department);
                updateWorkorderProperty('departmentDesc', data.departmentdisc); // 'disc' is not a typo (well, it is in Infor's response ;-) )
                updateWorkorderProperty('locationCode', data.parentlocation);
                updateWorkorderProperty('locationDesc', data.locationdesc);
                updateWorkorderProperty('costCode', data.equipcostcode);
                updateWorkorderProperty('costCodeDesc', '');
                //Set the equipment work order
                setWOEquipment(value);
            }).catch(error => {
                //Simply don't assign values
            });
        }
    };

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
                                     autocompleteHandler={WS.autocompleteEquipment}
                                     onChangeValue={onChangeEquipment}
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
                    renderSuggestion={suggestion => suggestion.desc}
                    renderValue={value => value.desc || value.code}
                    updateProperty={updateWorkorderProperty}/>

                <EAMSelect
                    children={children}
                    elementInfo={workOrderLayout.fields['workorderstatus']}
                    valueKey="statusCode"
                    values={layout.statusValues}
                    value={workorder.statusCode}
                    renderSuggestion={suggestion => suggestion.desc}
                    renderValue={value => value.desc || value.code}
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

                {/*<EAMAutocomplete children={children}*/}
                                 {/*elementInfo={workOrderLayout.fields['standardwo']}*/}
                                 {/*value={workorder.standardWO}*/}
                                 {/*valueKey="standardWO"*/}
                                 {/*valueDesc={workorder.standardWODesc}*/}
                                 {/*descKey="standardWODesc"*/}
                                 {/*updateProperty={updateWorkorderProperty}*/}
                                 {/*onChangeValue={props.readStandardWorkOrder}*/}
                                 {/*autocompleteHandler={WSWorkorders.autocompleteStandardWorkOrder.bind(null, userData.eamAccount.userGroup)}/>*/}

                <EAMInput
                        elementInfo={{...workOrderLayout.fields['parentwo'], readonly: true}}
                        value={workorder.parentWO}
                        valueKey="parentWO"
                        updateProperty={updateWorkorderProperty}
                        link={() => workorder.parentWO && rpawClassesList.includes(workorder.classCode) ? rpawLink + workorder.parentWO : null}
                />

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

                <UDFChar fieldInfo={workOrderLayout.fields['udfchar24']}
                         fieldValue={workorder.userDefinedFields.udfchar24}
                         fieldValueDesc={workorder.userDefinedFields.udfchar24Desc}
                         fieldKey={`userDefinedFields.udfchar24`}
                         descKey={`userDefinedFields.udfchar01Desc`}
                         updateUDFProperty={updateWorkorderProperty}
                         children={children}
                         link={() => workorder.userDefinedFields.udfchar24 ? "https://its.cern.ch/jira/browse/" + workorder.userDefinedFields.udfchar24 : null}
                />

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

                <EAMInput
                    children={children}
                    elementInfo={workOrderLayout.fields['downtimehours']}
                    value={workorder.downtimeHours}
                    updateProperty={updateWorkorderProperty}
                    valueKey="downtimeHours"/>

            </div>
        </EISPanel>
    )

}

export default WorkorderDetails
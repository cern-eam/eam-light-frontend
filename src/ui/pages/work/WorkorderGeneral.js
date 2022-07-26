import React, {useCallback} from 'react';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import WS from '../../../tools/WS'
import WSWorkorders from "../../../tools/WSWorkorders"
import OpenInAppIcon from 'mdi-material-ui/OpenInApp'
import OpenInNewIcon from 'mdi-material-ui/OpenInNew'
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

function WorkorderDetails(props) {

    const { children, workOrderLayout, workorder, updateWorkorderProperty, layout, applicationData, userData } = props;
    const rpawClassesList = (applicationData && applicationData.EL_TRPAC && applicationData.EL_TRPAC.split(',')) || [];
    const rpawLink = applicationData && applicationData.EL_TRPAW;

    return (
        <React.Fragment>

            <EAMTextField
                {...processElementInfo(workOrderLayout.fields['description'])}
                value={workorder.description}
                updateProperty={updateWorkorderProperty}
                valueKey="description"/>

            <EAMAutocomplete 
                {...processElementInfo(workOrderLayout.fields['equipment'])}
                value={workorder.equipmentCode}
                valueKey="equipmentCode"
                desc={workorder.equipmentDesc}
                descKey="equipmentDesc"
                barcodeScanner
                updateProperty={updateWorkorderProperty}
                autocompleteHandler={WS.autocompleteEquipment}
                link={() => workorder.equipmentCode ? "/equipment/" + workorder.equipmentCode : null}/>
  
            <EAMAutocomplete
                {...processElementInfo(workOrderLayout.fields['location'])}
                value={workorder.locationCode}
                valueKey="locationCode"
                desc={workorder.locationDesc}
                descKey="locationDesc"
                updateProperty={updateWorkorderProperty}
                autocompleteHandler={WS.autocompleteLocation}
                />

            <EAMAutocomplete
                {...processElementInfo(workOrderLayout.fields['department'])}
                value={workorder.departmentCode}
                valueKey="departmentCode"
                desc={workorder.departmentDesc}
                descKey="departmentDesc"
                updateProperty={updateWorkorderProperty}
                autocompleteHandler={WS.autocompleteDepartment}/>

            <EAMSelect
                {...processElementInfo(workOrderLayout.fields['workordertype'])}
                valueKey="typeCode"
                value={workorder.typeCode}
                descKey="typeDesc"
                desc={workorder.typeDesc}
                renderSuggestion={suggestion => suggestion.desc}
                renderValue={value => value.desc || value.code}
                updateProperty={updateWorkorderProperty}
                options={layout.typeValues}
                // autocompleteHandler={WSWorkorders.getWorkOrderTypeValues}
                // autocompleteHandlerParams = {[userData.eamAccount.userGroup]}
                />

            <EAMSelect
                {...processElementInfo(workOrderLayout.fields['workorderstatus'])}
                valueKey="statusCode"
                value={workorder.statusCode}
                descKey="statusDesc"
                desc={workorder.statusDesc}
                renderSuggestion={suggestion => suggestion.desc}
                renderValue={value => value.desc || value.code}
                updateProperty={updateWorkorderProperty}
                options={layout.statusValues}
                //autocompleteHandler={WSWorkorders.getWorkOrderStatusValues}
                //autocompleteHandlerParams = {[userData.eamAccount.userGroup, workorder.statusCode, workorder.typeCode, false]}
                />

            <EAMSelect
                {...processElementInfo(workOrderLayout.fields['priority'])}
                valueKey="priorityCode"
                value={workorder.priorityCode}
                descKey="priorityDesc"
                desc={workorder.priorityDesc}
                updateProperty={updateWorkorderProperty}
                autocompleteHandler={WSWorkorders.getWorkOrderPriorities}/>

            <EAMAutocomplete 
                {...processElementInfo(workOrderLayout.fields['woclass'])}
                value={workorder.classCode}
                valueKey="classCode"
                desc={workorder.classDesc}
                descKey="classDesc"
                updateProperty={updateWorkorderProperty}
                autocompleteHandler={(filter, config) => WS.autocompleteClass('EVNT', filter, config)}/>

            <EAMAutocomplete 
                    {...processElementInfo(workOrderLayout.fields['standardwo'])}
                    value={workorder.standardWO}
                    valueKey="standardWO"
                    valueDesc={workorder.standardWODesc}
                    descKey="standardWODesc"
                    updateProperty={updateWorkorderProperty}
                    autocompleteHandler={WSWorkorders.autocompleteStandardWorkOrder.bind(null, userData.eamAccount.userGroup)}/>

            <EAMTextField
                {...processElementInfo(workOrderLayout.fields['targetvalue'])}
                value={
                    // Avoid displaying 'NaN'
                    workorder.targetValue &&
                    // Show at least 2 decimal places or more according to the saved value.
                    // The 2nd use of parseFloat() removes the non-significant trailing zeros set by the backend.
                    parseFloat(workorder.targetValue).toFixed(
                        Math.max(
                            2,
                            (parseFloat(workorder.targetValue).toString().split(".")[1] || []).length
                        )
                    )
                }
                updateProperty={updateWorkorderProperty}
                valueKey="targetValue"/>

            <EAMTextField
                    {...processElementInfo({...workOrderLayout.fields['parentwo'], readonly: true})}
                    value={workorder.parentWO}
                    valueKey="parentWO"
                    updateProperty={updateWorkorderProperty}
                    link={() => workorder.parentWO && rpawClassesList.includes(workorder.classCode) ? rpawLink + workorder.parentWO : null}
                    icon={<OpenInAppIcon/>}/>


            <EAMTextField 
                        {...processElementInfo(workOrderLayout.fields['udfchar01'])}
                        value={workorder.userDefinedFields.udfchar01}
                        valueKey={`userDefinedFields.udfchar01`}
                        desc={workorder.userDefinedFields.udfchar01Desc}
                        descKey={`userDefinedFields.udfchar01Desc`}
                        updateProperty={updateWorkorderProperty}
                        link={() => workorder.userDefinedFields.udfchar01 ? "https://cern.service-now.com/task.do?sysparm_query=number=" + workorder.userDefinedFields.udfchar01 : null}
                        />

            <EAMTextField 
                        {...processElementInfo(workOrderLayout.fields['udfchar20'])}
                        value={workorder.userDefinedFields.udfchar20}
                        desc={workorder.userDefinedFields.udfchar20Desc}
                        valueKey={`userDefinedFields.udfchar20`}
                        descKey={`userDefinedFields.udfchar20Desc`}
                        updateProperty={updateWorkorderProperty}/>

            <EAMTextField 
                        {...processElementInfo(workOrderLayout.fields['udfchar24'])}
                        value={workorder.userDefinedFields.udfchar24}
                        desc={workorder.userDefinedFields.udfchar24Desc}
                        valueKey={`userDefinedFields.udfchar24`}
                        descKey={`userDefinedFields.udfchar01Desc`}
                        updateProperty={updateWorkorderProperty}
                        link={() => workorder.userDefinedFields.udfchar24 ? "https://its.cern.ch/jira/browse/" + workorder.userDefinedFields.udfchar24 : null}
                        icon={<OpenInNewIcon/>}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['udfchkbox01'])}
                        value={workorder.userDefinedFields.udfchkbox01}
                        updateProperty={updateWorkorderProperty}
                        valueKey={`userDefinedFields.udfchkbox01`}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['udfchkbox02'])}
                        value={workorder.userDefinedFields.udfchkbox02}
                        updateProperty={updateWorkorderProperty}
                        valueKey={`userDefinedFields.udfchkbox02`}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['udfchkbox03'])}
                        value={workorder.userDefinedFields.udfchkbox03}
                        updateProperty={updateWorkorderProperty}
                        valueKey={`userDefinedFields.udfchkbox03`}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['udfchkbox04'])}
                        value={workorder.userDefinedFields.udfchkbox04}
                        updateProperty={updateWorkorderProperty}
                        valueKey={`userDefinedFields.udfchkbox04`}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['udfchkbox05'])}
                        value={workorder.userDefinedFields.udfchkbox05}
                        updateProperty={updateWorkorderProperty}
                        valueKey={`userDefinedFields.udfchkbox05`}/>

            <EAMCheckbox {...processElementInfo(workOrderLayout.fields['warranty'])}
                value={workorder.warranty}
                updateProperty={updateWorkorderProperty}
                valueKey={`warranty`}
            />

            <EAMTextField
                {...processElementInfo(workOrderLayout.fields['downtimehours'])}
                value={workorder.downtimeHours}
                updateProperty={updateWorkorderProperty}
                valueKey="downtimeHours"/>

        </React.Fragment>
    )

}

export default WorkorderDetails
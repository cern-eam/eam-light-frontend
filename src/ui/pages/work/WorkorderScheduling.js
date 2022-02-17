import React from 'react';
import EAMDateTimePicker from 'eam-components/dist/ui/components/muiinputs/EAMDateTimePicker';
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WS from '../../../tools/WS';
import UDFChar from '../../components/userdefinedfields/UDFChar';
import { Grid } from '@material-ui/core';

const WorkorderScheduling = (props) => {
    const { children, workOrderLayout, workorder, updateWorkorderProperty, updateScheduleProperty } = props;

    if (
        'H' === workOrderLayout.fields.reqstartdate.attribute &&
        'H' === workOrderLayout.fields.reqenddate.attribute &&
        'H' === workOrderLayout.fields.schedstartdate.attribute &&
        'H' === workOrderLayout.fields.schedenddate.attribute &&
        'H' === workOrderLayout.fields.datecompleted.attribute &&
        'H' === workOrderLayout.fields.startdate.attribute &&
        'H' === workOrderLayout.fields.reportedby.attribute &&
        'H' === workOrderLayout.fields.assignedto.attribute &&
        'H' === workOrderLayout.fields.udfchar17.attribute
    ) {
        return null;
    }

    return (
        <div style={{ width: '100%', marginTop: 0 }}>
            <Grid container justify="space-between" spacing={2}>
                <Grid item xs={6}>
                    <EAMAutocomplete
                        children={children}
                        elementInfo={workOrderLayout.fields['createdby']}
                        value={workorder.createdBy}
                        updateProperty={updateWorkorderProperty}
                        valueKey="createdBy"
                        valueDesc={workorder.createdByDesc}
                        descKey="createdByDesc"
                        autocompleteHandler={WS.autocompleteEmployee}
                    />
                </Grid>

                <Grid item xs={6}>
                    <EAMDatePicker
                        children={children}
                        elementInfo={workOrderLayout.fields['datecreated']}
                        valueKey="createdDate"
                        value={workorder.createdDate || ''}
                        updateProperty={updateWorkorderProperty}
                    />
                </Grid>
            </Grid>

            <EAMAutocomplete
                children={children}
                elementInfo={workOrderLayout.fields['reportedby']}
                value={workorder.reportedBy}
                updateProperty={updateWorkorderProperty}
                valueKey="reportedBy"
                valueDesc={workorder.reportedByDesc}
                descKey="reportedByDesc"
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMAutocomplete
                children={children}
                elementInfo={workOrderLayout.fields['assignedto']}
                value={workorder.assignedTo}
                updateProperty={updateWorkorderProperty}
                valueKey="assignedTo"
                valueDesc={workorder.assignedToDesc}
                descKey="assignedToDesc"
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMDatePicker
                children={children}
                elementInfo={workOrderLayout.fields['reqstartdate']}
                valueKey="requestedStartDate"
                value={workorder.requestedStartDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDatePicker
                children={children}
                elementInfo={workOrderLayout.fields['reqenddate']}
                valueKey="requestedEndDate"
                value={workorder.requestedEndDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDatePicker
                children={children}
                elementInfo={workOrderLayout.fields['schedstartdate']}
                valueKey="scheduledStartDate"
                value={workorder.scheduledStartDate || ''}
                updateProperty={updateScheduleProperty}
            />

            <EAMDatePicker
                children={children}
                elementInfo={workOrderLayout.fields['schedenddate']}
                valueKey="scheduledEndDate"
                value={workorder.scheduledEndDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                children={children}
                elementInfo={workOrderLayout.fields['startdate']}
                valueKey="startDate"
                value={workorder.startDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                children={children}
                elementInfo={workOrderLayout.fields['datecompleted']}
                valueKey="completedDate"
                value={workorder.completedDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                children={children}
                elementInfo={workOrderLayout.fields['datereported']}
                valueKey="reportedDate"
                value={workorder.reportedDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <UDFChar
                fieldInfo={workOrderLayout.fields['udfchar17']}
                fieldValue={workorder.userDefinedFields.udfchar17}
                fieldValueDesc={workorder.userDefinedFields.udfchar17Desc}
                fieldKey={`userDefinedFields.udfchar17`}
                descKey={`userDefinedFields.udfchar17Desc`}
                updateUDFProperty={updateWorkorderProperty}
                children={children}
            />

            <UDFChar
                fieldInfo={workOrderLayout.fields['udfchar19']}
                fieldValue={workorder.userDefinedFields.udfchar19}
                fieldValueDesc={workorder.userDefinedFields.udfchar19Desc}
                fieldKey={`userDefinedFields.udfchar19`}
                descKey={`userDefinedFields.udfchar19Desc`}
                updateUDFProperty={updateWorkorderProperty}
                children={children}
            />
        </div>
    );
};

export default WorkorderScheduling;

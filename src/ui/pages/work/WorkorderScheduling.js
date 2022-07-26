import React from 'react';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from '../../../tools/WS';
import { Grid } from '@mui/material';
import EAMUDF from 'eam-components/dist/ui/components/inputs-ng/EAMUDF';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

const WorkorderScheduling = (props) => {
    const { children, workOrderLayout, workorder, updateWorkorderProperty } = props;

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
        <React.Fragment>
            <Grid container justifyContent="space-between" spacing={2}>
                <Grid item xs={6}>
                    <EAMAutocomplete
                        style = {{minWidth: 0}}
                        {...processElementInfo(workOrderLayout.fields['createdby'])}
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
                        style = {{minWidth: 0}}
                        {...processElementInfo(workOrderLayout.fields['datecreated'])}
                        valueKey="createdDate"
                        value={workorder.createdDate || ''}
                        updateProperty={updateWorkorderProperty}
                    />
                </Grid>
            </Grid>

            <EAMAutocomplete
                {...processElementInfo(workOrderLayout.fields['reportedby'])}
                value={workorder.reportedBy}
                updateProperty={updateWorkorderProperty}
                valueKey="reportedBy"
                desc={workorder.reportedByDesc}
                descKey="reportedByDesc"
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMAutocomplete
                {...processElementInfo(workOrderLayout.fields['assignedto'])}
                value={workorder.assignedTo}
                updateProperty={updateWorkorderProperty}
                valueKey="assignedTo"
                desc={workorder.assignedToDesc}
                descKey="assignedToDesc"
                barcodeScanner
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMDatePicker
                {...processElementInfo(workOrderLayout.fields['reqstartdate'])}
                valueKey="requestedStartDate"
                value={workorder.requestedStartDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDatePicker
               {...processElementInfo(workOrderLayout.fields['reqenddate'])}
                valueKey="requestedEndDate"
                value={workorder.requestedEndDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDatePicker
                {...processElementInfo(workOrderLayout.fields['schedstartdate'])}
                valueKey="scheduledStartDate"
                value={workorder.scheduledStartDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDatePicker
                {...processElementInfo(workOrderLayout.fields['schedenddate'])}
                valueKey="scheduledEndDate"
                value={workorder.scheduledEndDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                {...processElementInfo(workOrderLayout.fields['startdate'])}
                valueKey="startDate"
                value={workorder.startDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                {...processElementInfo(workOrderLayout.fields['datecompleted'])}
                valueKey="completedDate"
                value={workorder.completedDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMDateTimePicker
                {...processElementInfo(workOrderLayout.fields['datereported'])}
                valueKey="reportedDate"
                value={workorder.reportedDate || ''}
                updateProperty={updateWorkorderProperty}
            />

            <EAMUDF
                elementInfo={workOrderLayout.fields['udfchar17']}
                value={workorder.userDefinedFields.udfchar17}
                valueKey={`userDefinedFields.udfchar17`}
                desc={workorder.userDefinedFields.udfchar17Desc}
                descKey={`userDefinedFields.udfchar17Desc`}
                updateProperty={updateWorkorderProperty}
            />

            <EAMUDF
                elementInfo={workOrderLayout.fields['udfchar19']}
                value={workorder.userDefinedFields.udfchar19}
                valueKey={`userDefinedFields.udfchar19`}
                desc={workorder.userDefinedFields.udfchar19Desc}
                descKey={`userDefinedFields.udfchar19Desc`}
                updateProperty={updateWorkorderProperty}
            />
        </React.Fragment>
    );
};

export default WorkorderScheduling;

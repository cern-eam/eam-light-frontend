import React from 'react';
import EAMDateTimePicker from 'eam-components/ui/components/inputs-ng/EAMDateTimePicker';
import EAMDatePicker from 'eam-components/ui/components/inputs-ng/EAMDatePicker';
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WS from '../../../tools/WS';
import { Grid } from '@mui/material';
import EAMUDF from 'eam-components/ui/components/inputs-ng/EAMUDF';

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
        <div style={{ width: '100%', marginTop: 0 }}>
            <Grid container justifyContent="space-between" spacing={2}>
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
                desc={workorder.reportedByDesc}
                descKey="reportedByDesc"
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMAutocomplete
                children={children}
                elementInfo={workOrderLayout.fields['assignedto']}
                value={workorder.assignedTo}
                updateProperty={updateWorkorderProperty}
                valueKey="assignedTo"
                desc={workorder.assignedToDesc}
                descKey="assignedToDesc"
                barcodeScanner={true}
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
                updateProperty={updateWorkorderProperty}
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
        </div>
    );
};

export default WorkorderScheduling;

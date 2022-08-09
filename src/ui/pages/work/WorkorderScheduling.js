import React from 'react';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from '../../../tools/WS';
import EAMUDF from 'eam-components/dist/ui/components/inputs-ng/EAMUDF';

const WorkorderScheduling = (props) => {
    const { workOrderLayout, workorder, updateWorkorderProperty, register } = props;

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
            
            <div style={{display: "flex"}}>
                <EAMAutocomplete {...register('createdby','createdBy','createdByDesc')}/>
                <EAMDatePicker {...register('datecreated','createdDate')}/>
            </div>

            <EAMAutocomplete
                {...register('reportedby','reportedBy','reportedByDesc')}
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMAutocomplete
                {...register('assignedto','assignedTo','assignedToDesc')}
                barcodeScanner
                autocompleteHandler={WS.autocompleteEmployee}
            />

            <EAMDatePicker
                {...register('reqstartdate','requestedStartDate')}/>

            <EAMDatePicker
                {...register('reqenddate','requestedEndDate')}/>

            <EAMDatePicker
                {...register('schedstartdate','scheduledStartDate')}/>

            <EAMDatePicker
                {...register('schedenddate','scheduledEndDate')}/>

            <EAMDateTimePicker
                {...register('startdate','startDate')}/>

            <EAMDateTimePicker
                {...register('datecompleted','completedDate')}/>

            <EAMDateTimePicker
                {...register('datereported','reportedDate')}/>

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

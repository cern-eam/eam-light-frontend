import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import { readUserCodes } from '../../../../tools/WSGrids';

const PositionDetails = (props) => {

    const { register } = props;

    return (
        <React.Fragment>

            <EAMAutocomplete {...register('class')} />

            <EAMAutocomplete {...register('category')} />

            <EAMDatePicker {...register('commissiondate')} />

            <EAMAutocomplete {...register('assignedto')} />

            <EAMSelect {...register('criticality')}
                autocompleteHandler={readUserCodes}
                autocompleteHandlerParams={["OBCR"]}
            />

            <EAMAutocomplete {...register('manufacturer')} />

            <EAMTextField {...register('serialnumber')} />

            <EAMTextField {...register('model')} />

        </React.Fragment>
    );
}

export default PositionDetails;

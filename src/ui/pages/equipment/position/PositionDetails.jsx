import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker'
import { readUserCodes } from '../../../../tools/WSGrids';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';

const PositionDetails = (props) => {

    const { register } = props;

    return (
        <React.Fragment>

            <EAMComboAutocomplete {...register('class')} />

            <EAMComboAutocomplete {...register('category')} />

            <EAMDatePicker {...register('commissiondate')} />

            <EAMComboAutocomplete {...register('assignedto')} />

            <EAMComboAutocomplete {...register('criticality')}
                autocompleteHandler={readUserCodes}
                autocompleteHandlerParams={["OBCR"]}
            />

            <EAMComboAutocomplete {...register('manufacturer')} />

            <EAMTextField {...register('serialnumber')} />

            <EAMTextField {...register('model')} />

        </React.Fragment>
    );
}

export default PositionDetails;

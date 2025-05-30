import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

const EAMInput = ({ type = 'text', ...props }) => {

    switch (type) {
        case 'checkbox':
            return <EAMCheckbox {...props} />;
        case 'date':
            return <EAMDatePicker {...props} />;
        case 'datetime':
            return <EAMDateTimePicker {...props} />;
        case 'autocomplete':
            return <EAMAutocomplete {...props} />;
        case 'select':
            return <EAMSelect {...props} />;
        case 'number':
        case 'currency':
            return <EAMTextField type="number" {...props} />;
        default:
            return <EAMTextField type="text" {...props} />;
    }
};

export default EAMInput;

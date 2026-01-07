import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';

const EAMInput = (props) => {

    const {type, autocompleteHandler} = props;

    if (autocompleteHandler) {
        return <EAMComboAutocomplete {...props} />
    }

    switch (type) {
        case 'checkbox':
            return <EAMCheckbox {...props} />;
        case 'date':
            return <EAMDatePicker {...props} />;
        case 'datetime':
            return <EAMDateTimePicker {...props} />;
        case 'number':
        case 'currency':
            return <EAMTextField type="number" {...props} />;
        default:
            return <EAMTextField type="text" {...props} />;
    }
};

export default EAMInput;

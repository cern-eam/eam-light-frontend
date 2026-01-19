import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMDateTimePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDateTimePicker';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMUDF from './userdefinedfields/EAMUDF';

const EAMInput = (props) => {

    const {type, autocompleteHandler, elementInfo, disabled} = props;

    if (elementInfo.elementId?.startsWith('udf')) {
        return <EAMUDF {...props}/>
    }

    if (autocompleteHandler && !disabled) {
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

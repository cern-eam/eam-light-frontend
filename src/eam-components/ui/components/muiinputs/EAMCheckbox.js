import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import EAMBaseInput from './EAMBaseInput';

const checkBoxStyle = {
    width: '50%',
    fontSize: '14px',
    float: 'left',
    boxSizing: 'border-box',
    display: 'block',
};

class EAMCheckbox extends EAMBaseInput {
    init = (props) => {
        const checkedTextValue = props.value || '';
        this.setValue(checkedTextValue.toLowerCase() === true.toString(), false);
    };

    handleChange = (event, checked) => {
        this.onChangeHandler(checked.toString());
    };

    renderComponent() {
        const { elementInfo } = this.props;
        return (
            <div style={checkBoxStyle}>
                <FormControlLabel
                    label={elementInfo && elementInfo.text}
                    control={
                        <Checkbox
                            color="primary"
                            checked={!!this.state.value}
                            value={this.props.value || ''}
                            onChange={this.handleChange}
                            disabled={this.state.disabled || (elementInfo && elementInfo.readonly)}
                        />
                    }
                />
            </div>
        );
    }
}

export default EAMCheckbox;

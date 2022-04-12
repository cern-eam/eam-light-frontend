import React from 'react';
import EAMBaseInput from './EAMBaseInput';
import EAMTextField from './EAMTextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class EAMInput extends EAMBaseInput {

    init = props => this.setValue(props.value || '')

    onLoseFocus = () => {
        //TODO prep input (e.g. uppercase)
        this.onChangeHandler(this.state.value)
    }

    generateInputProps = (props) => {
        let InputProps = {};
        if (props.startAdornment) {
            InputProps["startAdornment"] = <InputAdornment position="start">{props.startAdornment}</InputAdornment>;
        }
        
        if (props.endAdornment) {
            InputProps["endAdornment"] = <InputAdornment position="end">{props.endAdornment}</InputAdornment>;
        }

        return {InputProps};
    }


    renderComponent () {
        const { elementInfo } = this.props;

        return (
            <EAMTextField
                disabled={this.state.disabled || (elementInfo  && elementInfo.readonly)}
                error={this.state.error}
                helperText={this.state.helperText}
                required={this.isRequired()}
                label={elementInfo && elementInfo.text}
                value={this.state.value}
                onChange={event => this.setValue(event.target.value)}
                onBlur={this.onLoseFocus}
                InputLabelProps={{ shrink: true }}
                {...this.generateInputProps(this.props)}/>
        )
    }
}

export default EAMInput
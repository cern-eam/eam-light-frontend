import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import EAMBaseInput from "./EAMBaseInput";

export default class EAMRadio extends EAMBaseInput {

    generateRadioButtons = (values) => {
        if (values) {
            return values.map(value => (
                <FormControlLabel key={value.code} value={value.code} control={<Radio color="primary"/>}
                                  label={value.desc}/>
            ));
        }
    };

    render() {
        const {elementId, text, nullable} = this.props.elementInfo;

        if (this.isHidden()) {
            return <div/>
        }

        return (
            <FormControl fullWidth margin="normal" required={this.isRequired()} style={{marginBottom: '0px'}}>
                <FormLabel component="legend">{text}</FormLabel>
                <RadioGroup
                    aria-label={elementId}
                    name={elementId}
                    value={this.props.value || ''}
                    onChange={event => this.onChangeHandler(this.props.valueKey, event.target.value)}
                    style={{flexDirection: 'row'}}>
                    {this.generateRadioButtons(this.props.values)}
                </RadioGroup>
            </FormControl>
        )
    }
}
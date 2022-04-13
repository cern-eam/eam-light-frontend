import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import EAMBaseInput from "./EAMBaseInput";

export default class EamlightRadio extends EAMBaseInput {

    init = props => this.setValue(props.value, false)

    generateRadioButtons = (values) => {
        if (values) {
            return values.map(value => (
                <FormControlLabel key={value.code} value={value.code} control={<Radio color="primary"/>}
                                  label={value.desc}/>
            ));
        }
    };

    renderComponent () {
        const { elementInfo } = this.props;

        return (
            <FormControl fullWidth margin="normal" required={this.isRequired()} style={{marginBottom: '0px'}}>
                <FormLabel component="legend">{elementInfo && elementInfo.text}</FormLabel>
                <RadioGroup
                    aria-label={elementInfo && elementInfo.elementId}
                    name={elementInfo && elementInfo.elementId}
                    value={this.props.value || ''}
                    onChange={event => this.onChangeHandler(event.target.value)}
                    style={{flexDirection: 'row'}}>
                    {this.generateRadioButtons(this.props.values)}
                </RadioGroup>
            </FormControl>
        )
    }
}
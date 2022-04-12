import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import EAMBaseInput, {formStyles} from "./EAMBaseInput";
import EAMFormLabel from "./EAMFormLabel";
import {withStyles} from "@material-ui/core/styles/index";

class EAMCheckbox extends EAMBaseInput {

    onChangeHandler = (event, checked) => {
        const value = checked ? this.props.trueValue : this.props.falseValue;
        this.props.updateProperty(this.props.valueKey, value);
        //Extra function if needed
        if (this.props.onChangeValue) {
            this.props.onChangeValue(value);
        }
    };

    renderComponent () {
        const {labelStyle, elementInfo, label} = this.props;

        return (
            <div className={this.props.classes.fieldContainer}>
                <EAMFormLabel required={this.isRequired()} label={label || (elementInfo && elementInfo.text)}
                               labelStyle={labelStyle} error={this.state.error}/>
                <div style={{width: "100%"}}>
                    <Checkbox color="primary"
                              checked={this.props.value === this.props.trueValue}
                              value={'' + this.props.value}
                              onChange={(event, checked) => this.onChangeHandler(event, checked)}
                              disabled={this.state.disabled || (elementInfo && elementInfo.readonly)}
                    />
                </div>
            </div>
        );
    }
}

EAMCheckbox.defaultProps = {
    trueValue: 'true',
    falseValue: 'false'
};

export default withStyles(formStyles)(EAMCheckbox);

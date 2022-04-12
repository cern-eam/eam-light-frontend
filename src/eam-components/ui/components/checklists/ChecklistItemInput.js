import React, {Component} from 'react';
import ChecklistFieldNumeric from './fields/ChecklistFieldNumeric';
import ChecklistFieldCheckbox from './fields/ChecklistFieldCheckbox';
import ChecklistFieldFinding from './fields/ChecklistFieldFinding';

export default class ChecklistItemInput extends Component {
    handleChange(type, value, onFail) {
        const {result, finding, numericValue} = this.props.checklistItem;

        let newResult,  newFinding, newNumericValue;

        switch(type) {
            case ChecklistItemInput.FIELD.CHECKBOX:
                newResult = (value === result) ? null : value;
                break;
            case ChecklistItemInput.FIELD.FINDING:
                newFinding = value;
                break;
            case ChecklistItemInput.FIELD.NUMERIC:
                newNumericValue = value;
                break;
        }

        let newProps = {
            ...this.props.checklistItem,
            result: newResult === undefined ? result : newResult,
            finding: newFinding === undefined ? finding : newFinding,
            numericValue: newNumericValue === undefined ? numericValue : newNumericValue
        };

        if(this.options.beforeOnChange && typeof this.options.beforeOnChange === 'function') {
            newProps = this.options.beforeOnChange(newProps, type, value);
        }

        this.props.onChange(newProps, onFail);

    }

    renderField(field, key) {
        var { checklistItem, showError, disabled } = this.props;

        const type = field[0];
        const options = field[1] || {};

        switch(type) {
            case ChecklistItemInput.FIELD.CHECKBOX:
                return <ChecklistFieldCheckbox
                    code={options.code}
                    desc={options.desc}
                    checked={checklistItem.result === options.code}
                    handleChange={code => this.handleChange(ChecklistItemInput.FIELD.CHECKBOX, code)}
                    key={key}
                    disabled={disabled}
                />
            case ChecklistItemInput.FIELD.FINDING:
                return <ChecklistFieldFinding
                    dropdown={options.dropdown}
                    finding={checklistItem.finding}
                    handleChange={code => this.handleChange(ChecklistItemInput.FIELD.FINDING, code)}
                    possibleFindings={checklistItem.possibleFindings}
                    key={key}
                    disabled={disabled}
                />
            case ChecklistItemInput.FIELD.NUMERIC:
                return <ChecklistFieldNumeric
                    value={checklistItem.numericValue}
                    UOM={checklistItem.UOM}
                    minimumValue={checklistItem.minimumValue}
                    maximumValue={checklistItem.maximumValue}
                    handleChange={(value, onFail) => this.handleChange(ChecklistItemInput.FIELD.NUMERIC, value, onFail)}
                    key={key}
                    showError={showError}
                    disabled={disabled}
                />
        }
    }

    render() {
        var {fields, options} = this.props;

        this.options = options;

        let fieldsRender = [];

        let key = 0;
        for(const field of fields) {
            fieldsRender.push(this.renderField(field, ++key));
        }

        return <div style={options.style || ChecklistItemInput.STYLE.ROWS}>
            {fieldsRender}
        </div>
    }
}

ChecklistItemInput.FIELD = {
    CHECKBOX: "CHECKBOX",
    NUMERIC: "NUMERIC",
    FINDING: "FINDING"
}

const SINGLE = {
    flex: "0 0 186px",
    display: "flex",
    marginLeft: "auto"
}

const ROWS = {
    flex: "0 0 186px",
    display: "flex",
    position: "relative",
    marginLeft: "auto",
    flexDirection: "column"
}

const SAMELINE = {
    flex: "0 0 186px",
    display: "flex",
    marginLeft: "auto",
    flexWrap: "wrap",
    justifyContent: "space-between"
}

ChecklistItemInput.STYLE = {
    SINGLE,
    ROWS,
    SAMELINE
};

ChecklistItemInput.createField = (type, options) => [type, options];
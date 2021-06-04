import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UDFChar from "./UDFChar";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMDatePicker from "eam-components/dist/ui/components/muiinputs/EAMDatePicker";
import EAMDateTimePicker from "eam-components/dist/ui/components/muiinputs/EAMDateTimePicker";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";

/**
 * Receive props:
 * fields: The user defined fields of the entity
 * entityLayout: Layout to identify which fields to render
 * updateUDFProperty: Function to update the property of a udf
 */
class UserDefinedFields extends Component {

    renderUdfChars = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfchar')
                && !prop.includes('Desc')
                && !exclusions.includes(prop))
            .map(prop => <UDFChar
                key={prop}
                fieldInfo={entityLayout[prop]}
                fieldValue={fields[prop]}
                fieldValueDesc={fields[`${prop}Desc`]}
                fieldKey={`userDefinedFields.${prop}`}
                updateUDFProperty={updateUDFProperty}
                children={children}/>);
    };

    renderUdfNums = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfnum') && !exclusions.includes(prop))
            .map(prop => <EAMInput
                key={prop}
                elementInfo={entityLayout[prop]}
                value={fields[prop]}
                updateProperty={updateUDFProperty}
                valueKey={`userDefinedFields.${prop}`}
                children={children}/>);
    };

    renderUdfDates = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfdate') && !exclusions.includes(prop))
            .map(prop => {
                const PickerComponent = entityLayout[prop].fieldType === 'datetime'
                    ? EAMDateTimePicker
                    : EAMDatePicker;

                return <PickerComponent
                    key={prop}
                    elementInfo={entityLayout[prop]}
                    value={fields[prop]}
                    updateProperty={updateUDFProperty}
                    valueKey={`userDefinedFields.${prop}`}
                    children={children}/>
            });
    };

    renderUdfCheckboxs = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfchk') && !exclusions.includes(prop))
            .map(prop => <EAMCheckbox
                key={prop}
                elementInfo={entityLayout[prop]}
                value={fields[prop]}
                updateProperty={updateUDFProperty}
                valueKey={`userDefinedFields.${prop}`}
                children={children}/>);
    };

    sortProperties = () => {
        let sortableProps = [];
        for (let prop in this.props.entityLayout) {
            if (this.props.entityLayout.hasOwnProperty(prop))
                sortableProps.push(prop);
        }
        sortableProps.sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        return sortableProps;
    };

    render() {
        return (
            <div style={{width: "100%", marginTop: 0}}>
                {this.renderUdfChars()}
                {this.renderUdfNums()}
                {this.renderUdfDates()}
                {this.renderUdfCheckboxs()}
            </div>
        );
    }
}

UserDefinedFields.propTypes = {
    entityLayout: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    updateUDFProperty: PropTypes.func,
    exclusions: PropTypes.array,
};

UserDefinedFields.defaultProps = {
    exclusions: [],
};

export default UserDefinedFields;
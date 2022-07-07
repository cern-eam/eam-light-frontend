import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EAMUDF from 'eam-components/ui/components/inputs-ng/EAMUDF';
import EAMCheckbox from 'eam-components/ui/components/inputs-ng/EAMCheckbox';


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
            .map(prop => <EAMUDF
                key={prop}
                elementInfo={entityLayout[prop]}
                value={fields[prop]}
                valueKey={`userDefinedFields.${prop}`}
                desc={fields[`${prop}Desc`]}  
                descKey={`userDefinedFields.${prop}Desc`}
                updateProperty={updateUDFProperty}
                children={children}/>);
    };

    renderUdfNums = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }


        return this.sortProperties()
            .filter(prop => prop.startsWith('udfnum') && !exclusions.includes(prop))
            .map(prop => <EAMUDF
                key={prop}
                elementInfo={entityLayout[prop]}
                value={fields[prop]}
                updateProperty={updateUDFProperty}
                valueKey={`userDefinedFields.${prop}`}
                children={children}
                endAdornment={entityLayout[prop] && entityLayout[prop].udfUom}/>);
    };

    renderUdfDates = () => {
        const { entityLayout, exclusions, fields, updateUDFProperty, children } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfdate') && !exclusions.includes(prop))
            .map(prop => {
                // const PickerComponent = entityLayout[prop].fieldType === 'datetime'
                //     ? EAMDateTimePicker
                //     : EAMDatePicker;

                return <EAMUDF
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
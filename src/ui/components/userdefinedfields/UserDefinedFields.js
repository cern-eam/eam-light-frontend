import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EAMUDF from './EAMUDF';

/**
 * Receive props:
 * fields: The user defined fields of the entity
 * entityLayout: Layout to identify which fields to render
 * updateUDFProperty: Function to update the property of a udf
 */
class UserDefinedFields extends Component {

    renderUdfChars = () => {
        const { entityLayout, exclusions, register } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfchar')
                && !prop.includes('Desc')
                && !exclusions.includes(prop))
            .map(prop => <EAMUDF
                {...register(prop, `userDefinedFields.${prop}`, `userDefinedFields.${prop}Desc`)}/>);
    };

    renderUdfNums = () => {
        const { entityLayout, exclusions, register } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfnum') && !exclusions.includes(prop))
            .map(prop => <EAMUDF {...register(prop, `userDefinedFields.${prop}`)}/>);
    };

    renderUdfDates = () => {
        const { entityLayout, exclusions, register } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfdate') && !exclusions.includes(prop))
            .map(prop => <EAMUDF {...register(prop, `userDefinedFields.${prop}`)}/>);
    };

    renderUdfCheckboxs = () => {
        const { entityLayout, exclusions, register } = this.props;

        if (!entityLayout) {
            return null;
        }

        return this.sortProperties()
            .filter(prop => prop.startsWith('udfchk') && !exclusions.includes(prop))
            .map(prop => <EAMUDF {...register(prop, `userDefinedFields.${prop}`)}/>);
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
            <React.Fragment>
                {this.renderUdfChars()}
                {this.renderUdfNums()}
                {this.renderUdfDates()}
                {this.renderUdfCheckboxs()}
            </React.Fragment>
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
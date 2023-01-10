import React from 'react';
import PropTypes from 'prop-types';
import EAMUDF from './EAMUDF';

const UserDefinedFields = (props) => {

    const { entityLayout, exclusions, register } = props;

    const renderUdfs = () => {
        return Object.keys(entityLayout).filter(key => key.startsWith('udf'))
                                        .filter(prop => !prop.includes('Desc') && !exclusions.includes(prop))
                                        .sort( (udf1, udf2) => entityLayout[udf1].fieldGroup -  entityLayout[udf2].fieldGroup || entityLayout[udf1].fieldContainer.localeCompare(entityLayout[udf2].fieldContainer))
                                        .map(prop => <EAMUDF key={prop} {...register(prop, `userDefinedFields.${prop}`, prop.includes('Desc') ? `userDefinedFields.${prop}Desc` : undefined)}/>);
    };

    return (
        <React.Fragment>
            {renderUdfs()}
        </React.Fragment>
    );
    
}

UserDefinedFields.propTypes = {
    entityLayout: PropTypes.object.isRequired,
    exclusions: PropTypes.array,
};

UserDefinedFields.defaultProps = {
    exclusions: [],
};

export default UserDefinedFields;
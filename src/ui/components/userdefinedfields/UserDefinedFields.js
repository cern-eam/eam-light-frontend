import React from 'react';
import PropTypes from 'prop-types';
import EAMUDF from './EAMUDF';

const UserDefinedFields = (props) => {

    const { entityLayout, exclusions, register } = props;

    

    const renderUdfs = () => {
        let udfs = [];

        udfs.push(...Object.keys(entityLayout).filter(key => key.startsWith('udfchar')));
        udfs.push(...Object.keys(entityLayout).filter(key => key.startsWith('udfnum')));
        udfs.push(...Object.keys(entityLayout).filter(key => key.startsWith('udfdate')));
        udfs.push(...Object.keys(entityLayout).filter(key => key.startsWith('udfchk')));

        return udfs.filter(prop => !prop.includes('Desc') && !exclusions.includes(prop))
                            .map(prop => <EAMUDF {...register(prop, `userDefinedFields.${prop}`, prop.includes('Desc') ? `userDefinedFields.${prop}Desc` : undefined)}/>);
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
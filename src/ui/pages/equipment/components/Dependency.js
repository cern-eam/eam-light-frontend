import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import IconButton from '@mui/material/IconButton';

const Dependency = (props) => {

    const { value, valueKey, updateProperty, disabled, relatedDependenciesKeysMap } = props;

    const isTrue = (value) => {
        const checkedTextValue = value || '';
        return checkedTextValue.toLowerCase() === true.toString();
    };

    const unsetRelatedDependencies = () => {
        const relatedDependencies = Object.values(relatedDependenciesKeysMap).filter(
            (depKey) => {
                return depKey !== valueKey;
            }
        );

        relatedDependencies.forEach((relatedDependency) => {
            updateProperty(relatedDependency, false.toString());
        });
    };

    const onClickHandler = () => {
        // A 'value' of 'false' means the dependency will be set to 'true' afterwards
        if (relatedDependenciesKeysMap && value === 'false') {
            unsetRelatedDependencies();
        }

        isTrue(value)
            ? updateProperty(valueKey, 'false')
            : updateProperty(valueKey, 'true');
    };

    return (
        <>
            <IconButton disabled={disabled} onClick={onClickHandler}>
                {isTrue(value) ? <LinkIcon /> : <LinkOffIcon />}
            </IconButton>
        </>
    );
}

export default Dependency;

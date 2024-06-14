import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { Switch, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const switchIconStyle = {
    fill: 'white',
    borderRadius: '50%'
}

const Dependency = (props) => {

    const { value, valueKey, updateProperty, disabled, dependencyKeysMap } = props;

    const theme = useTheme();

    const isTrue = (value) => {
        const checkedTextValue = value || '';
        return checkedTextValue.toLowerCase() === true.toString();
    };

    const unsetRelatedDependencies = () => {
        const relatedDependencies = Object.values(
            dependencyKeysMap
        ).filter((depKey) => {
            return depKey !== valueKey;
        });

        relatedDependencies.forEach((relatedDependency) => {
            updateProperty(relatedDependency, false.toString());
        });
    };

    const onChangeHandler = () => {
        // A 'value' of 'false' means the dependency will be set to 'true' afterwards
        if (dependencyKeysMap && value === 'false') {
            unsetRelatedDependencies();
        }

        isTrue(value)
            ? updateProperty(valueKey, 'false')
            : updateProperty(valueKey, 'true');
    };

    return (
        <>
            <Tooltip title={ 
                isTrue(value) ? "Remove dependency on this input"
                : "Add dependency on this input"}>
                <Switch
                    style = {{ height: '100%' }}
                    disabled={disabled} 
                    onChange={onChangeHandler} 
                    checked={isTrue(value)}
                    icon={ 
                        <LinkOffIcon 
                        style={{ 
                            ...switchIconStyle,
                            backgroundColor: disabled ? '#ccc' : '#737373'
                        }}/>
                    }
                    checkedIcon={
                        <LinkIcon 
                        style={{
                            ...switchIconStyle,
                            backgroundColor: `${theme.palette.primary.main}`
                        }}/>
                    }
                />
            </Tooltip>
        </>
    );
}

export default Dependency;

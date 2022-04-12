import React from 'react'

const EAMGridKeyboardHandler = (props) => {
    const { onSearch, toggleFilters } = props;
    const handleUserKeyPress = React.useCallback(event => {
        switch (event.key) {
            case 'Enter':
            case 'F8':
                onSearch();
                break;
            case 'F7':
                toggleFilters();
                break
            default:
                break;
        }
    }, [onSearch, toggleFilters]);
    
    React.useEffect(() => {
        window.addEventListener('keydown', handleUserKeyPress);
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return null;
}

export default EAMGridKeyboardHandler

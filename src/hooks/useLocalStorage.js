import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue, initialOverride) => {
    const [overriden, setOverriden] = useState(initialOverride !== undefined);

    const [stateValue, setStateValue] = useState(() => {
        try {
            if (overriden) {
                return initialOverride;
            }
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    });

    const setValue = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            if (overriden) {
                setOverriden(false);
            }
        } catch (e) {
        }
        setStateValue(value);
    }

    return [stateValue, setValue];
};

export default useLocalStorage;
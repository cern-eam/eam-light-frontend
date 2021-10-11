import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue) => {
    const [stateValue, setStateValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    });

    const setValue = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
        }
        setStateValue(value);
    }

    return [stateValue, setValue];
};

export default useLocalStorage;
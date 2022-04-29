import { useCallback, useState } from 'react';

export const useMultipleToggle = <Keys>(
    keys: Keys[],
): {
    values: { [key: string]: boolean };
    onSwitchOn: (key: Keys) => void;
    onSwitchToggle: (key: Keys) => void;
    onSwitchOff: () => void;
} => {
    const [values, setValues] = useState(() => {
        const initialState = {} as { [key: string]: boolean };

        return keys.reduce((acc, b) => ({ ...acc, [b]: false }), initialState);
    });

    const handleSwitchOn = useCallback((key: Keys) => {
        setValues(prev => {
            const keys = Object.keys(prev);

            keys.forEach(objectKey =>
                objectKey === key ? (prev[objectKey] = true) : (prev[objectKey] = false),
            );

            return { ...prev };
        });
    }, []);

    const handleSwitchOff = useCallback(() => {
        setValues(prev => {
            const keys = Object.keys(prev);

            keys.forEach(objectKey => (prev[objectKey] = false));

            return { ...prev };
        });
    }, []);

    const handleSwitchToggle = useCallback((key: Keys) => {
        setValues(prev => {
            const keys = Object.keys(prev);

            keys.forEach(objectKey =>
                objectKey === key
                    ? (prev[objectKey] = !prev[objectKey])
                    : (prev[objectKey] = false),
            );

            return { ...prev };
        });
    }, []);

    return {
        values,
        onSwitchOn: handleSwitchOn,
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle,
    };
};

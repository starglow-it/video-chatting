import { useCallback, useState } from 'react';

type Values<Keys> = { [key in keyof Keys]: boolean };

export const useMultipleToggle = <Keys>(
    keys: (keyof Keys)[],
    defaultKey?: keyof Keys,
): {
    values: Values<Keys>;
    onSwitchOn: (key: keyof Keys) => void;
    onSwitchToggle: (key: keyof Keys) => void;
    onSwitchOff: () => void;
} => {
    const [values, setValues] = useState(() => {
        const initialState = {} as Values<Keys>;

        return keys.reduce(
            (acc, b) => ({ ...acc, [b]: defaultKey === b }),
            initialState,
        );
    });

    const handleSwitchOn = useCallback((key: keyof Keys) => {
        setValues(prev => {
            const prevEntries = Object.entries(prev) as [keyof Keys, boolean][];

            const initialState = {} as Values<Keys>;

            return prevEntries.reduce(
                (acc, b) => ({ ...acc, [b[0]]: b[0] === key }),
                initialState,
            );
        });
    }, []);

    const handleSwitchOff = useCallback(() => {
        setValues(prev => {
            const prevEntries = Object.entries(prev) as [keyof Keys, boolean][];

            const initialState = {} as Values<Keys>;

            return prevEntries.reduce(
                (acc, b) => ({ ...acc, [b[0]]: false }),
                initialState,
            );
        });
    }, []);

    const handleSwitchToggle = useCallback((key: keyof Keys) => {
        setValues(prev => {
            const prevEntries = Object.entries(prev) as [keyof Keys, boolean][];

            const initialState = {} as Values<Keys>;

            return prevEntries.reduce(
                (acc, b) => ({ ...acc, [b[0]]: key === b[0] ? !b[1] : false }),
                initialState,
            );
        });
    }, []);

    return {
        values,
        onSwitchOn: handleSwitchOn,
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle,
    };
};

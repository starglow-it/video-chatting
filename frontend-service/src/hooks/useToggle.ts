import { useState, useCallback } from 'react';

export const useToggle = (
    initial: boolean,
): {
    value: boolean;
    onSwitchOn: () => void;
    onSwitchOff: () => void;
    onToggleSwitch: () => void;
} => {
    const [switchValue, setSwitchValue] = useState<boolean>(initial);

    const handleSwitchOn = useCallback(() => {
        setSwitchValue(true);
    }, []);

    const handleSwitchOff = useCallback(() => {
        setSwitchValue(false);
    }, []);

    const handleToggleSwitch = useCallback(() => {
        setSwitchValue(prev => !prev);
    }, []);

    return {
        value: switchValue,
        onSwitchOn: handleSwitchOn,
        onSwitchOff: handleSwitchOff,
        onToggleSwitch: handleToggleSwitch,
    };
};

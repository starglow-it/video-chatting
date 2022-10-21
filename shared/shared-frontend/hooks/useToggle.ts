import { useEffect, useState, useCallback } from 'react';

export const useToggle = (
    initial: boolean,
): {
    value: boolean;
    onSwitchOn: () => void;
    onSwitchOff: () => void;
    onToggleSwitch: () => void;
    onSetSwitch: (value: boolean) => void;
} => {
    const [switchValue, setSwitchValue] = useState<boolean>(initial);

    useEffect(() => {
        setSwitchValue(initial);
    }, [initial]);

    const handleSwitchOn = useCallback(() => {
        setSwitchValue(true);
    }, []);

    const handleSwitchOff = useCallback(() => {
        setSwitchValue(false);
    }, []);

    const handleToggleSwitch = useCallback(() => {
        setSwitchValue(prev => !prev);
    }, []);

    const handleSetSwitch = useCallback(value => {
        setSwitchValue(value);
    }, []);

    return {
        value: switchValue,
        onSwitchOn: handleSwitchOn,
        onSwitchOff: handleSwitchOff,
        onToggleSwitch: handleToggleSwitch,
        onSetSwitch: handleSetSwitch,
    };
};

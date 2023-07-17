import { useCallback, useEffect, useRef, useState } from 'react';
import { ONE_SECOND } from '../const/time/common';

export const useTimer = (isForward: boolean) => {
    const [value, setValue] = useState(0);
    const intervalRef = useRef<number>();

    useEffect(
        () => () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                setValue(0);
            }
        },
        [],
    );

    const handleStartTimer = useCallback(
        (startValue: number, maxValue: number) => {
            window.clearInterval(intervalRef.current);
            setValue(startValue);

            intervalRef.current = window?.setInterval(() => {
                setValue(prev => {
                    if (isForward ? prev > maxValue : prev < maxValue) {
                        window.clearInterval(intervalRef.current);
                        return prev;
                    }
                    return isForward ? prev + ONE_SECOND : prev - ONE_SECOND;
                });
            }, ONE_SECOND);
        },
        [],
    );

    const handleStopTimer = useCallback(() => {
        window.clearInterval(intervalRef.current);
    }, []);

    return {
        value,
        onStartTimer: handleStartTimer,
        onEndTimer: handleStopTimer,
    };
};

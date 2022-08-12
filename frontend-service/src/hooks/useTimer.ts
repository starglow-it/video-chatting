import { useCallback, useEffect, useRef, useState } from 'react';
import { ONE_SECOND } from '../const/time/common';

export const useTimer = () => {
    const [value, setValue] = useState(0);
    const intervalRef = useRef<number>();

    useEffect(
        () => () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                setValue(0);
            }
        },
        [],
    );

    const handleStartTimer = useCallback((startValue: number, maxValue: number) => {
        setValue(startValue);
        intervalRef.current = setInterval(() => {
            setValue(prev => {
                if (prev > maxValue) {
                    clearInterval(intervalRef.current);
                    return prev;
                }
                return prev + ONE_SECOND;
            });
        }, ONE_SECOND);
    }, []);

    const handleStopTimer = useCallback(() => {
        clearInterval(intervalRef.current);
    }, []);

    return {
        value,
        onStartTimer: handleStartTimer,
        onEndTimer: handleStopTimer,
    };
};

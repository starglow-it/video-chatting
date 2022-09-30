import { useCallback, useMemo, useRef, useState } from 'react';

type UseCountDownReturn = {
    value: number;
    onStartCountDown: () => void;
    onStopCountDown: () => void;
};

export const useCountDown = (initialValue: number): UseCountDownReturn => {
    const [countdown, setCountdown] = useState(0);
    const intervalRef = useRef<number>();

    const handleStartCountDown = useCallback(() => {
        setCountdown(Math.floor(initialValue));
        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (!prev) {
                    clearInterval(intervalRef.current);
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const handleStopTimer = useCallback(() => {
        setCountdown(0);
        clearInterval(intervalRef.current);
    }, []);

    return useMemo(
        () => ({
            value: countdown,
            onStartCountDown: handleStartCountDown,
            onStopCountDown: handleStopTimer,
        }),
        [countdown],
    );
};

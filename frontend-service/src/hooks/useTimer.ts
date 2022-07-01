import {useCallback, useRef, useState} from "react";
import {ONE_SECOND} from "../const/time/common";

export const useTimer = (initialValue: number, maxValue: number) => {
    const [value, setValue] = useState(0);
    const intervalRef = useRef<number>();

    const handleStartTimer = useCallback(() => {
        setValue(Math.floor(initialValue));
        intervalRef.current = setInterval(() => {
            setValue(prev => {
                if (!prev || prev > maxValue) {
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
        onEndTimer: handleStopTimer
    }
}
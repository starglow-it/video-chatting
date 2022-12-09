import { useCallback, useMemo, useState } from 'react';
import {ValuesSwitcherItem} from "shared-frontend/types";

type ValueType = string | number;

type UseValueSwitcherArgs<T extends ValueType> = {
    values: ValuesSwitcherItem<T>[];
    initialValue: T;
};

type UseValueSwitcherReturnType<T extends ValueType> = {
    activeValue: T;
    activeItem: ValuesSwitcherItem<T>;
    onValueChange: (item: ValuesSwitcherItem<T>) => void;
    onNextValue: () => void;
    onPreviousValue: () => void;
};

export const useValueSwitcher = <T extends ValueType>({
    values,
    initialValue,
}: UseValueSwitcherArgs<T>): UseValueSwitcherReturnType<T> => {
    const [activeValue, setActiveValue] = useState<T>(initialValue);

    const activeItem = useMemo(
        () => values.find(item => item.value === activeValue) || values[0],
        [values, activeValue],
    );

    const handleValueChange = useCallback(({ value }: ValuesSwitcherItem<T>) => {
        setActiveValue(value);
    }, []);

    const handleNextValue = useCallback(() => {
        const currentInd = values.findIndex(({ value }) => activeValue === value);
        const newInd = currentInd + 1 === values.length ? currentInd : currentInd + 1;

        setActiveValue(values[newInd].value);
    }, [activeValue]);

    const handlePreviousValue = useCallback(() => {
        const currentInd = values.findIndex(({ value }) => activeValue === value);
        const newInd = currentInd - 1 === -1 ? currentInd : currentInd - 1;

        setActiveValue(values[newInd].value);
    }, [activeValue]);

    return {
        activeValue,
        activeItem,
        onValueChange: handleValueChange,
        onNextValue: handleNextValue,
        onPreviousValue: handlePreviousValue,
    };
};

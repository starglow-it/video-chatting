import { useCallback, useMemo, useState } from 'react';
import {ValuesSwitcherItem} from "../types";

type ValueType = string | number;

type UseValueSwitcherArgs<T extends ValueType, Label extends string> = {
    values: ValuesSwitcherItem<T, Label>[];
    initialValue: T;
};

type UseValueSwitcherReturnType<T extends ValueType, Label extends string> = {
    activeValue: T;
    activeItem: ValuesSwitcherItem<T, Label>;
    onValueChange: (item: ValuesSwitcherItem<T, Label>) => void;
    onNextValue: () => void;
    onPreviousValue: () => void;
};

export const useValueSwitcher = <T extends ValueType, Label extends string>({
  values,
  initialValue,
}: UseValueSwitcherArgs<T, Label>): UseValueSwitcherReturnType<T, Label> => {
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

import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { useCallback, useMemo, useState } from 'react';

type UseValueSwitcherArgs = {
    values: ValuesSwitcherItem[];
    initialValue: string;
};

type UseValueSwitcherReturnType = {
    activeValue: string;
    activeItem: ValuesSwitcherItem;
    onValueChange: (item: ValuesSwitcherItem) => void;
    onNextValue: () => void;
};

export const useValueSwitcher = ({
    values,
    initialValue,
}: UseValueSwitcherArgs): UseValueSwitcherReturnType => {
    const [activeValue, setActiveValue] = useState(initialValue);

    const activeItem = useMemo(
        () => values.find(item => item.value === activeValue) || values[0],
        [values, activeValue],
    );

    const handleValueChange = useCallback(({ value }: ValuesSwitcherItem) => {
        setActiveValue(value);
    }, []);

    const handleNextValue = useCallback(() => {
        const currentInd = values.findIndex(({ value }) => activeValue === value);
        const newInd = currentInd + 1 === values.length ? currentInd : currentInd + 1;

        setActiveValue(values[newInd].value);
    }, [activeValue]);

    return {
        activeValue,
        activeItem,
        onValueChange: handleValueChange,
        onNextValue: handleNextValue,
    };
};

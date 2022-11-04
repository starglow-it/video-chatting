type ValueType = string | number;

export type ValuesSwitcherItem<T extends ValueType> = {
    id: number;
    value: T;
    label: string;
};

type ValueSwitcherVariant = 'primary' | 'transparent';

export type ValueSwitcherProps<T extends ValueType> = {
    values: ValuesSwitcherItem<T>[];
    activeValue: ValuesSwitcherItem<T>;
    onValueChanged: (value: ValuesSwitcherItem<T>) => Promise<void> | void;
    variant?: ValueSwitcherVariant;
    className?: string;
};

export type ValueSwitcherItemProps<T extends ValueType> = {
    index: number;
    value: ValuesSwitcherItem<T>;
    activeValue: ValuesSwitcherItem<T>;
    onValueChanged: (value: ValuesSwitcherItem<T>) => void;
    variant?: ValueSwitcherVariant;
};

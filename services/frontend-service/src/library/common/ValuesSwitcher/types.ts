type ValueType = string | number;

export type ValuesSwitcherItem<T extends ValueType> = {
    id: number;
    value: T;
    label: string;
};

type ValueSwitcherVariant = 'primary' | 'transparent';

export type ValueSwitcherProps<T extends ValueType> = {
    values: ValuesSwitcherItem<T>[];
    optionWidth: number;
    activeValue: ValuesSwitcherItem<T>;
    onValueChanged: (value: ValuesSwitcherItem<T>) => Promise<void> | void;
    variant?: ValueSwitcherVariant;
};

export type ValueSwitcherItemProps<T extends ValueType> = {
    index: number;
    optionWidth: number;
    value: ValuesSwitcherItem<T>;
    activeValue: ValuesSwitcherItem<T>;
    onValueChanged: (value: ValuesSwitcherItem<T>) => void;
    onUpdateActiveElement: (left: number) => void;
    variant?: ValueSwitcherVariant;
};

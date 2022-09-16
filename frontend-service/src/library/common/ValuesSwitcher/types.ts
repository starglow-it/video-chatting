export type ValuesSwitcherItem = {
    id: number;
    value: string;
    label: string;
};

type ValueSwitcherVariant = 'primary' | 'transparent';

export type ValueSwitcherProps = {
    values: ValuesSwitcherItem[];
    optionWidth: number;
    activeValue: ValuesSwitcherItem;
    onValueChanged: (value: ValuesSwitcherItem) => void;
    variant?: ValueSwitcherVariant;
};

export type ValueSwitcherItemProps = {
    index: number;
    optionWidth: number;
    value: ValuesSwitcherItem;
    activeValue: ValuesSwitcherItem;
    onValueChanged: (value: ValuesSwitcherItem) => void;
    onUpdateActiveElement: (left: number) => void;
    variant?: ValueSwitcherVariant;
};

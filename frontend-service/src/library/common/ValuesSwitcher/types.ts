export type ValuesSwitcherItem = {
    id: number;
    value: string;
    label: string;
}

export type ValueSwitcherProps = {
    values: ValuesSwitcherItem[];
    optionWidth: number;
    activeValue: ValuesSwitcherItem;
    onValueChanged: (value: ValuesSwitcherItem) => void;
}

export type ValueSwitcherItemProps = {
    index: number;
    optionWidth: number;
    value: ValuesSwitcherItem;
    activeValue: ValuesSwitcherItem;
    onValueChanged: (value: ValuesSwitcherItem) => void;
    onUpdateActiveElement: (left: number) => void;
}
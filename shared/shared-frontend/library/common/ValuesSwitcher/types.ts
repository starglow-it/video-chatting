import {PropsWithClassName, ValuesSwitcherItem} from "../../../types";

export type ValueType = string | number;

type ValueSwitcherVariant = 'primary' | 'transparent';

export type ValueSwitcherProps<T extends ValueType, Label> = PropsWithClassName<{
    values: ValuesSwitcherItem<T, Label>[];
    activeValue: ValuesSwitcherItem<T, Label>;
    onValueChanged: (value: ValuesSwitcherItem<T, Label>) => Promise<void> | void;
    variant?: ValueSwitcherVariant;
    itemClassName?: string;
    width?: number;
}>;

export type ValueSwitcherItemProps<T extends ValueType, Label> = PropsWithClassName<{
    index: number;
    value: ValuesSwitcherItem<T, Label>;
    activeValue: ValuesSwitcherItem<T, Label>;
    onValueChanged: (value: ValuesSwitcherItem<T, Label>) => Promise<void> | void
    variant?: ValueSwitcherVariant;
}>;

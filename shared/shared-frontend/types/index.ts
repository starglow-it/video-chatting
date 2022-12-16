export type PropsWithClassName<T> = T & { className?: string };

type ValueType = string | number;

export type ValuesSwitcherItem<Value extends ValueType, Label = string> = {
    id: number;
    value: Value;
    label: Label;
};

export type AutocompleteType<ValueType> = ValueType & { key: string; value: string; label: string };

export type ParticipantPosition = {
    id: string;
    top: number;
    left: number;
};


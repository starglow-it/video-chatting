export type PropsWithClassName<T> = T & { className?: string };

export type ValuesSwitcherItem<T extends ValueType> = {
    id: number;
    value: T;
    label: string;
};

export type AutocompleteType<ValueType> = ValueType & { key: string; value: string; label: string };

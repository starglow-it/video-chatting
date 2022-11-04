export type PropsWithClassName<T> = T & { className?: string };

export type ValuesSwitcherItem<T extends ValueType> = {
    id: number;
    value: T;
    label: string;
};
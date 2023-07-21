import { ValuesSwitcherItem } from 'shared-frontend/types';

export const currencies: Record<string, string> = {
    cad: 'C$',
    usd: '$',
};

export const currencyValues: ValuesSwitcherItem<'USD' | 'CAD'>[] = [
    { id: 1, value: 'USD', label: 'USD' },
    { id: 2, value: 'CAD', label: 'CAD' },
];

import { ValuesSwitcherItem } from 'shared-frontend/types';

export const currencies: Record<string, string> = {
    cad: 'C$',
    usd: '$',
};

export const currencyValues: ValuesSwitcherItem<
    'USD' | 'CAD' | 'GBP' | 'EUR' | 'INR' | 'AUS'
>[] = [
    { id: 1, value: 'USD', label: 'USD' },
    { id: 2, value: 'CAD', label: 'CAD' },
    { id: 3, value: 'GBP', label: 'GBP' },
    { id: 4, value: 'EUR', label: 'EUR' },
    { id: 5, value: 'INR', label: 'INR' },
    { id: 6, value: 'AUD', label: 'AUD' },
];

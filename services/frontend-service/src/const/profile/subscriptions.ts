import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';

export const planColors: Record<string, string> = {
    House: '#69E071',
    Professional: '#2E6DF2',
    Business: '#FFB84E',
    AllPlans: '#0F0F10',
};

export const currencies: Record<string, string> = {
    cad: 'C$',
    usd: '$',
};

export const currencyValues: ValuesSwitcherItem<'USD' | 'CAD'>[] = [
    { id: 1, value: 'USD', label: 'USD' },
    { id: 2, value: 'CAD', label: 'CAD' },
];

import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';

export const planColors: Record<string, string> = {
    House: '#69E071',
    Professional: '#2E6DF2',
    Business: '#FF884E',
    HouseDaily: '#69E071',
    ProfessionalDaily: '#2E6DF2',
    BusinessDaily: '#FF884E',
};

export const currencies: Record<string, string> = {
    cad: 'C$',
    usd: '$',
};

export const currencyValues: ValuesSwitcherItem[] = [
    { id: 1, value: 'USD', label: 'USD' },
    { id: 2, value: 'CAD', label: 'CAD' },
];

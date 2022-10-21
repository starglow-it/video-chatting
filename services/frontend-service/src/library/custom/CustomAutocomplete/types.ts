import { AutocompleteProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Control } from 'react-hook-form';

export type CustomAutocompleteProps<ValueType extends { key: string; value: string }> = Omit<
    AutocompleteProps<ValueType, true, true, true>,
    'renderInput' | 'renderTags'
> &
    PropsWithChildren & {
        control: Control;
        name: string;
        error?: string;
    };

export type AutocompleteType<ValueType> = ValueType & { key: string; value: string; label: string };

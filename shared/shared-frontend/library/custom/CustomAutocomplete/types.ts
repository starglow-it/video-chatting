import { AutocompleteProps } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { Control } from 'react-hook-form';

export type CustomAutocompleteProps<ValueType extends { key: string; value: string }> = Omit<
    AutocompleteProps<ValueType, true, true, true>,
    'renderInput' | 'renderTags'
> &
    PropsWithChildren & {
        control: Control;
        name: string;
        error?: string;
        errorComponent?: React.ReactNode;
    };


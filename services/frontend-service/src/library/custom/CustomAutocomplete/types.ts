import { AutocompleteProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { Control } from 'react-hook-form';

export type CustomAutocompleteProps = Omit<
    AutocompleteProps<string, true, true, true>,
    'renderInput' | 'renderTags'
> &
    PropsWithChildren & {
        control: Control;
        name: string;
        error?: string;
    };

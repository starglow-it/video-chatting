import React from 'react';

import { SelectProps } from '@mui/material';
import { TranslationProps } from '@library/common/Translation/types';

export interface CustomDropdownProps
    extends Omit<SelectProps<string[]>, 'error' | 'variant'>,
        TranslationProps {
    list: React.ReactNode;
    selectId: string;
    error?: string;
    variant?: 'primary' | 'transparent';
}

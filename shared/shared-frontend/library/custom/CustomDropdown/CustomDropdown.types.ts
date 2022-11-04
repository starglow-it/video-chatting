import React from 'react';

import { SelectProps } from '@mui/material';

export interface CustomDropdownProps extends Omit<SelectProps<string[]>, 'variant'> {
    list: React.ReactNode;
    selectId: string;
    variant?: 'primary' | 'transparent';
}

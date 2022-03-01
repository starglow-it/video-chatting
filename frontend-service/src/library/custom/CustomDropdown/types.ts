import React from 'react';

import { SelectProps } from '@mui/material';
import { TranslationProps } from '@library/common/Translation/types';

export type CustomDropdownProps = {
    list: React.ReactNode;
    selectId: string;
} & SelectProps &
    TranslationProps;

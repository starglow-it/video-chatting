import React from 'react';

import { TranslationProps } from '@library/common/Translation/types';
import { CheckboxProps } from '@mui/material/Checkbox/Checkbox';

type CustomCheckboxProps = React.PropsWithoutRef<{
    className?: string;
    labelClassName?: string;
    label?: string;
    translationProps?: TranslationProps;
}> &
    CheckboxProps;

export type { CustomCheckboxProps };

import React from 'react';

import { CheckboxProps } from '@mui/material/Checkbox/Checkbox';

type CustomCheckboxProps = React.PropsWithoutRef<{
    className?: string;
    labelClassName?: string;
    label?: string;
}> &
    CheckboxProps;

export type { CustomCheckboxProps };

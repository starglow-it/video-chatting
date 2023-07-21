import React, { ElementType } from 'react';

import { CheckboxProps } from '@mui/material/Checkbox/Checkbox';

type CustomCheckboxProps = React.PropsWithoutRef<{
    className?: string;
    labelClassName?: string;
    label?: string | JSX.Element;
}> &
    CheckboxProps;

export type { CustomCheckboxProps };

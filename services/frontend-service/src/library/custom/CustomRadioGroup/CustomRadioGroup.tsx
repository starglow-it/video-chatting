import { forwardRef, memo } from 'react';

import { RadioGroup, RadioGroupProps } from '@mui/material';

const Component = (
    { name, defaultValue, children, ...rest }: RadioGroupProps,
    ref,
) => (
    <RadioGroup ref={ref} defaultValue={defaultValue} name={name} {...rest}>
        {children}
    </RadioGroup>
);

export const CustomRadioGroup = memo(forwardRef(Component));

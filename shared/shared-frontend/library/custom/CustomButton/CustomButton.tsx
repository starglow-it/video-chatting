import React, { ForwardedRef, forwardRef, memo } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { CustomButtonProps } from './CustomButton.types';

type ComponentType = CustomButtonProps & ButtonProps;

const Component = (
    {
        disabled,
        Icon,
        type,
        label,
        variant = 'custom-primary',
        children,
        ...rest
    }: ComponentType,
    ref: ForwardedRef<HTMLButtonElement>,
) => (
    <Button disabled={disabled} variant={variant} type={type} ref={ref} {...rest}>
        {Icon}
        {children ? children : label}
    </Button>
);

const CustomButton = memo<ComponentType>(
    forwardRef<HTMLButtonElement, ComponentType>(Component),
);

export default CustomButton;

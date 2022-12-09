import React, { ForwardedRef, forwardRef, memo } from 'react';
import Button from '@mui/material/Button';
import { ButtonProps} from "@mui/material/Button/Button";
import {CustomTypography} from "../../custom/CustomTypography";

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
        typographyProps,
        ...rest
    }: ComponentType,
    ref: ForwardedRef<HTMLButtonElement>,
) => (
    <Button disabled={disabled} variant={variant} type={type} ref={ref} {...rest}>
        {Icon}
        {children || (
            <CustomTypography {...typographyProps}>
                {label}
            </CustomTypography>
        )}
    </Button>
);

const CustomButton = memo<ComponentType>(
    forwardRef<HTMLButtonElement, ComponentType>(Component),
);

export default CustomButton;

import React from 'react';
import { CustomTypographyProps } from '@library/custom/CustomTypography/types';

type CommonIconProps = {
    width?: string;
    height?: string;
    className?: string;
    isActive?: boolean;
    onClick?: ((() => void) & React.MouseEventHandler<any>) | undefined;
};

type CustomButtonProps = {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset' | undefined;
    typographyProps?: CustomTypographyProps;
};

export type { CustomButtonProps, CommonIconProps };

export type SliderArrowProps = {
    customClassName?: string;
    style?: string;
    onClick?: () => void;
};

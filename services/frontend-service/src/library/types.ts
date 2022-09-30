import React from 'react';
import { CustomTypographyProps } from '@library/custom/CustomTypography/types';

type CommonIconProps = {
    width: string;
    height: string;
    className?: string;
    isActive?: boolean;
    style?: React.CSSProperties;
    onClick?: ((() => void) & React.MouseEventHandler<unknown>) | undefined;
};

type CustomButtonProps = {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset' | undefined;
    typographyProps?: CustomTypographyProps;
    Icon?: React.ReactElement;
};

export type SliderArrowProps = {
    customClassName?: string;
    style?: string;
    onClick?: () => void;
    dotsRef: unknown;
};

export type { CustomButtonProps, CommonIconProps };

import React, { ForwardedRef, forwardRef, memo } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { CustomButtonProps } from '@library/types';
import { TranslationProps } from '../../common/Translation/types';
import { CustomTypography } from '../CustomTypography/CustomTypography';

type ComponentType = CustomButtonProps & TranslationProps & ButtonProps;

const Component = (
    {
        disabled,
        nameSpace,
        translation,
        Icon,
        type,
        variant = 'custom-primary',
        typographyProps,
        children,
        ...rest
    }: ComponentType,
    ref: ForwardedRef<HTMLButtonElement>,
) => (
    <Button disabled={disabled} variant={variant} type={type} ref={ref} {...rest}>
        {Icon}
        {nameSpace && translation ? (
            <CustomTypography
                nameSpace={nameSpace}
                translation={translation}
                {...typographyProps}
            />
        ) : (
            children
        )}
    </Button>
);

export const CustomButton = memo<ComponentType>(
    forwardRef<HTMLButtonElement, ComponentType>(Component),
);

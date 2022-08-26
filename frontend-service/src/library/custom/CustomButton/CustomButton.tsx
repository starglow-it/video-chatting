import React, { memo } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { CustomButtonProps } from '@library/types';
import { TranslationProps } from '../../common/Translation/types';
import { CustomTypography } from '../CustomTypography/CustomTypography';

type ComponentType = CustomButtonProps & TranslationProps & ButtonProps;

const Component = ({
    disabled,
    nameSpace,
    translation,
    Icon,
    type,
    variant = 'custom-primary',
    typographyProps,
    children,
    ...rest
}: ComponentType) => (
    <Button disabled={disabled} variant={variant} type={type} {...rest}>
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

export const CustomButton = memo<ComponentType>(Component);

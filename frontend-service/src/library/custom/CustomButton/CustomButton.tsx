import React, { memo } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { CustomButtonProps } from '@library/types';
import { TranslationProps } from '../../common/Translation/types';
import { CustomTypography } from '../CustomTypography/CustomTypography';

const CustomButton = memo(
    ({
        disabled,
        nameSpace,
        translation,
        type,
        variant = 'custom-primary',
        typographyProps,
        ...rest
    }: CustomButtonProps & Partial<TranslationProps> & ButtonProps) => {
        return (
            <Button disabled={disabled} variant={variant} type={type} {...rest}>
                <CustomTypography
                    nameSpace={nameSpace}
                    translation={translation}
                    {...typographyProps}
                />
            </Button>
        );
    },
);

export { CustomButton };

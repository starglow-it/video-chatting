import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import { ButtonUnstyled } from '@mui/base';

// types
import { ButtonProps } from '@mui/material';
import { ActionButtonProps } from './types';

// styles
import styles from './ActionButton.module.scss';

type ComponentPropsType = ActionButtonProps & Omit<ButtonProps, 'variant'>;

const Component = (
    { variant, Icon, onAction, className, ...rest }: ComponentPropsType,
    ref: ForwardedRef<HTMLButtonElement>,
) => {
    const buttonClassNames = clsx(
        styles.iconWrapper,
        variant && styles[variant],
        { [styles.withAction]: Boolean(onAction) },
        className,
    );

    const handleAction = useCallback(() => {
        onAction?.();
    }, [onAction]);

    return (
        <ButtonUnstyled ref={ref} className={buttonClassNames} onClick={handleAction} {...rest}>
            {Icon}
        </ButtonUnstyled>
    );
};

export const ActionButton = memo<ComponentPropsType>(
    forwardRef<HTMLButtonElement, ComponentPropsType>(Component),
);

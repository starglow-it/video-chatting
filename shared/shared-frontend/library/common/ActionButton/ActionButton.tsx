import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import { ButtonProps } from '@mui/material/Button/Button';

// types
import { ActionButtonProps } from './types';

// styles
import styles from './ActionButton.module.scss';

type ComponentPropsType = ActionButtonProps & Omit<ButtonProps, 'variant'>;

const Component = (
    { variant, label, Icon, onAction, className, ...rest }: ComponentPropsType,
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
            {Icon ?? label}
        </ButtonUnstyled>
    );
};

const ActionButton = memo<ComponentPropsType>(
    forwardRef<HTMLButtonElement, ComponentPropsType>(Component),
);

export default ActionButton;

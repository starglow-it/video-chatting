import React, {forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import { ButtonUnstyled } from '@mui/base';

// types
import { ActionButtonProps } from './types';
import { ButtonProps } from '@mui/material';

// styles
import styles from './ActionButton.module.scss';

type ComponentPropsType = ActionButtonProps & Omit<ButtonProps, "variant">;

const InitialComponent = (
    {
        variant,
        Icon,
        onAction,
        className,
        ...rest
    },
    ref,
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
        <ButtonUnstyled
            ref={ref}
            className={buttonClassNames}
            onClick={handleAction}
            {...rest}
        >
            {Icon}
        </ButtonUnstyled>
    );
};

const ActionButton = memo<ComponentPropsType>(forwardRef<HTMLButtonElement, ComponentPropsType>(InitialComponent));

export { ActionButton };

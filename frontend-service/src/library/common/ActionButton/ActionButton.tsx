import React, { forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import { ButtonUnstyled } from '@mui/core';

// types
import { ActionButtonProps } from './types';
import { ButtonProps } from '@mui/material';

// styles
import styles from './ActionButton.module.scss';

const ActionButton = memo(forwardRef((
    {
        variant,
        Icon,
        onAction,
        className,
        ...rest
    }: ActionButtonProps & Omit<ButtonProps, 'variant'>,
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
}));

export { ActionButton };

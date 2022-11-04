import React, { memo } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';
import clsx from 'clsx';

// types
import { CustomTooltipProps } from './types';

// styles
import styles from './CustomTooltip.module.scss';

const CustomTooltip = memo(
    ({
        children,
        popperClassName,
        title,
        variant = 'primary',
        options,
        ...rest
    }: CustomTooltipProps & Omit<TooltipProps, 'title'>) => (
        <Tooltip
            classes={{
                popper: clsx(styles.popper, popperClassName, {
                    [styles.blackGlass]: variant === 'black-glass',
                    [styles.white]: variant === 'white',
                }),
                tooltip: styles.tooltip,
                arrow: styles.arrow,
            }}
            title={title}
            {...rest}
        >
            {children}
        </Tooltip>
    ),
);

export default CustomTooltip;

import React, { memo } from 'react';
import clsx from 'clsx';

import { IconButton, IconButtonProps } from '@mui/material';

import { CustomIconButtonProps } from './types';
import styles from './CustomIconButton.module.scss';

const CustomIconButton = memo(
    ({ className, children, ...rest }: CustomIconButtonProps & IconButtonProps) => (
        <IconButton className={clsx(styles.iconButton, className)} {...rest}>
            {children}
        </IconButton>
    ),
);

export { CustomIconButton };

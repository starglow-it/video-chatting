import React, { memo } from 'react';
import Fade from '@mui/material/Fade';
import { Popper } from '@mui/material';
import clsx from 'clsx';

import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

import styles from './CustomPopper.module.scss';

import { CustomPopperProps } from './types';

const CustomPopper = memo(
    ({ id, open, anchorEl, children, className, ...rest }: CustomPopperProps) => (
        <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            className={clsx(className, styles.popper)}
            transition
            {...rest}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <CustomBox>{children}</CustomBox>
                </Fade>
            )}
        </Popper>
    ),
);

export { CustomPopper };

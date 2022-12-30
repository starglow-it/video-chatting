import React, { memo } from 'react';
import Popper from '@mui/material/Popper/Popper';
import clsx from 'clsx';

import {CustomFade} from "../CustomFade";

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
                <CustomFade {...TransitionProps} timeout={350}>
                    {children}
                </CustomFade>
            )}
        </Popper>
    ),
);

export default CustomPopper;

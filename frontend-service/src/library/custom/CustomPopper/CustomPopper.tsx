import React, { memo } from 'react';
import Fade from '@mui/material/Fade';
import { Popper } from '@mui/material';
import clsx from "clsx";

import styles from './CustomPopper.module.scss';

import { CustomPopperProps } from './types';

const CustomPopper = memo(({ id, open, anchorEl, children, className }: CustomPopperProps) => {
    return (
        <Popper id={id} open={open} anchorEl={anchorEl} className={clsx(className, styles.popper)} transition>
            {({ TransitionProps }) => <Fade {...TransitionProps}>{children}</Fade>}
        </Popper>
    );
});

export { CustomPopper };

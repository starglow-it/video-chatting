import React, { memo } from 'react';

import { Fade } from '@mui/material';

import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

import { PropsWithClassName } from 'shared-frontend/types';

const Component = ({
    open,
    className,
    children,
}: React.PropsWithChildren<PropsWithClassName<{ open: boolean }>>) => (
    <Fade in={open}>
        <CustomBox className={className}>{children}</CustomBox>
    </Fade>
);

export const CustomFade = memo(Component);

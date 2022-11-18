import React, { memo } from 'react';

import { Fade } from '@mui/material';

import { CustomBox } from '../../custom';

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

const CustomFade = memo(Component);

export default CustomFade;

import React, { memo } from 'react';

import Fade from '@mui/material/Fade';

import { CustomBox } from '../../custom/CustomBox';

import { PropsWithClassName } from 'shared-frontend/types';

const Component = ({
    open,
    className,
    children,
    ...rest
}: React.PropsWithChildren<PropsWithClassName<{ open: boolean }>>) => (
    <Fade in={open} {...rest}>
        <CustomBox className={className}>{children}</CustomBox>
    </Fade>
);

const CustomFade = memo(Component);

export default CustomFade;

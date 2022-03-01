import React, { ForwardedRef, forwardRef, memo } from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

import { CommonIconProps } from '../types';

const SvgIconWrapper = memo(
    forwardRef(
        (
            {
                width,
                height,
                children,
                className,
                onClick,
                ...rest
            }: React.PropsWithChildren<CommonIconProps> & SvgIconProps,
            ref: ForwardedRef<SVGSVGElement>,
        ) => {
            return (
                <SvgIcon
                    ref={ref}
                    sx={{ width, height }}
                    className={className}
                    onClick={onClick}
                    {...rest}
                >
                    {children}
                </SvgIcon>
            );
        },
    ),
);

export { SvgIconWrapper };

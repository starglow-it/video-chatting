import React, { ForwardedRef, forwardRef, memo } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import { CommonIconProps } from './types';

type ComponentProps = React.PropsWithChildren<CommonIconProps> & SvgIconProps;

const Component = (
    { width, height, color, children, className, onClick, ...rest }: ComponentProps,
    ref: ForwardedRef<SVGSVGElement>,
) => (
    <SvgIcon
        ref={ref}
        sx={{ width, height, color }}
        className={className || ''}
        onClick={onClick}
        {...rest}
    >
        {children}
    </SvgIcon>
);

export const SvgIconWrapper = memo<ComponentProps>(
    forwardRef<SVGSVGElement, ComponentProps>(Component),
);

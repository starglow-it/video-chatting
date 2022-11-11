import React, { memo } from 'react';
import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 34 34" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.7534 16.4925L13.4453 11.1844C12.8591 10.5981 12.8591 9.64765 13.4453 9.06141C14.0315 8.47518 14.982 8.47518 15.5682 9.06141L22.9985 16.4917L15.5533 23.9383C14.9671 24.5246 14.0166 24.5247 13.4303 23.9384C12.8441 23.3522 12.8441 22.4018 13.4303 21.8156L18.7534 16.4925Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export const ArrowRightIcon = memo(Component);

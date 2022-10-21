import React, { memo } from 'react';
import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const SuccessIcon = memo(({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        className={className}
        width={width}
        height={height}
        viewBox="0 0 28 28"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.5494 16.0474L18.6708 9.92596C19.1536 9.44318 19.9364 9.44318 20.4191 9.92596C20.9019 10.4087 20.9019 11.1915 20.4191 11.6743L12.5501 19.5433L7.58426 14.5786C7.10141 14.0959 7.10137 13.3131 7.58416 12.8303C8.06692 12.3476 8.84962 12.3476 9.33237 12.8303L12.5494 16.0474Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { SuccessIcon };

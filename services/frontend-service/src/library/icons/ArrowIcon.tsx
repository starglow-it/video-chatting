import React, { memo } from 'react';

import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const ArrowIcon = memo(({ className, height, width, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        viewBox="0 0 28 28"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.444 13.582L11.0726 9.21064C10.5898 8.72786 10.5898 7.94512 11.0726 7.46234C11.5553 6.97955 12.3381 6.97955 12.8209 7.46234L18.9399 13.5814L12.8086 19.7139C12.3258 20.1967 11.543 20.1968 11.0603 19.714C10.5775 19.2312 10.5775 18.4485 11.0603 17.9658L15.444 13.582Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { ArrowIcon };

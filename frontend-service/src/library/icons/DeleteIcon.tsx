import React, { memo } from 'react';
import { SvgIconWrapper } from './SvgIconWrapper';

import { CommonIconProps } from '@library/types';

const DeleteIcon = memo(({ width, height, className }: CommonIconProps) => {
    return (
        <SvgIconWrapper
            className={className}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.6586 7.34145C17.0261 7.709 17.0261 8.30492 16.6586 8.67247L13.331 12L16.6586 15.3276C17.0261 15.6951 17.0261 16.2911 16.6586 16.6586C16.291 17.0262 15.6951 17.0262 15.3275 16.6586L12 13.3311L8.67241 16.6586C8.30486 17.0262 7.70894 17.0262 7.34138 16.6586C6.97383 16.2911 6.97383 15.6951 7.34138 15.3276L10.6689 12L7.34138 8.67247C6.97383 8.30492 6.97383 7.709 7.34138 7.34145C7.70894 6.97389 8.30486 6.97389 8.67241 7.34145L12 10.669L15.3275 7.34145C15.6951 6.97389 16.291 6.97389 16.6586 7.34145Z"
                fill="currentColor"
            />
        </SvgIconWrapper>
    );
});

export { DeleteIcon };

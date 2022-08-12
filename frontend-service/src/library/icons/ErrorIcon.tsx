import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from './SvgIconWrapper';

const ErrorIcon = memo(({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        viewBox="0 0 15 15"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5936 4.40637C10.8377 4.65044 10.8377 5.04617 10.5936 5.29025L8.38388 7.49996L10.5936 9.70967C10.8377 9.95375 10.8377 10.3495 10.5936 10.5936C10.3495 10.8376 9.95379 10.8376 9.70971 10.5936L7.5 8.38384L5.29029 10.5936C5.04621 10.8376 4.65049 10.8376 4.40641 10.5936C4.16233 10.3495 4.16233 9.95375 4.40641 9.70967L6.61612 7.49996L4.40641 5.29025C4.16233 5.04617 4.16233 4.65044 4.40641 4.40637C4.65049 4.16229 5.04621 4.16229 5.29029 4.40637L7.5 6.61608L9.70971 4.40637C9.95379 4.16229 10.3495 4.16229 10.5936 4.40637Z"
            fill="#F55252"
        />
    </SvgIconWrapper>
));

export { ErrorIcon };

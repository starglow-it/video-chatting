import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const ArrowLeftIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 36 36" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.0959 17.4807L20.6913 23.0761C21.3093 23.694 21.3093 24.6959 20.6913 25.3139C20.0734 25.9319 19.0715 25.9319 18.4535 25.3139L10.6211 17.4815L18.4693 9.63189C19.0872 9.01386 20.0891 9.01381 20.7071 9.63179C21.325 10.2497 21.325 11.2516 20.7071 11.8695L15.0959 17.4807Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { ArrowLeftIcon };

import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        viewBox="0 0 24 24"
    >
        <path
            d="M12 20C7.58125 20 4 16.4187 4 12C4 7.58125 7.58125 4 12 4C16.4187 4 20 7.58125 20 12C20 16.4187 16.4187 20 12 20ZM11.25 12C11.25 12.25 11.375 12.4844 11.5844 12.5969L14.5844 14.5969C14.9281 14.8531 15.3938 14.7594 15.5969 14.4156C15.8531 14.0719 15.7594 13.6062 15.4156 13.375L12.75 11.6V7.75C12.75 7.33437 12.4156 7 11.9719 7C11.5844 7 11.2219 7.33437 11.2219 7.75L11.25 12Z"
            fill="currentColor"
            fillOpacity="0.6"
        />
    </SvgIconWrapper>
);

export const ClockIcon = memo<CommonIconProps>(Component);

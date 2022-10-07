import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 49 48"
        fill="none"
    >
        <circle cx="24.5" cy="24" r="24" fill="currentColor" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.5105 26.5098L33.0044 16.016C33.832 15.1884 35.1738 15.1884 36.0014 16.016V16.016C36.8291 16.8436 36.8291 18.1855 36.0014 19.0131L22.5116 32.5029L13.9988 23.992C13.1711 23.1644 13.171 21.8225 13.9986 20.9949V20.9949C14.8262 20.1673 16.168 20.1673 16.9956 20.9949L22.5105 26.5098Z"
            fill="white"
        />
    </SvgIconWrapper>
);

export const DoneIcon = memo(Component);

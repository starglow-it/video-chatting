import React, { memo } from 'react';

import { CommonIconProps } from '@library/types';

import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 18 18"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.92837 8.73135L7.11818 5.92116C6.80782 5.6108 6.80782 5.10761 7.11818 4.79725C7.42854 4.48689 7.93173 4.48689 8.24209 4.79725L12.1758 8.73094L8.23418 12.6733C7.92384 12.9837 7.42064 12.9837 7.11027 12.6733C6.79992 12.363 6.79992 11.8598 7.11027 11.5494L9.92837 8.73135Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const NewArrowIcon = memo(Component);

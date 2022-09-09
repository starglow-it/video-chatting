import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6417 13.2622L7.8948 17.0091C7.48098 17.4229 6.81006 17.4229 6.39625 17.0091C5.98244 16.5953 5.98243 15.9244 6.39625 15.5105L11.6412 10.2656L16.8976 15.5211C17.3115 15.9349 17.3115 16.6058 16.8977 17.0196C16.4839 17.4334 15.813 17.4334 15.3992 17.0196L11.6417 13.2622Z"
            fill="currentColor"
        />
        <path
            opacity="0.5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.6417 7.99337L7.8948 11.7403C7.48098 12.1541 6.81006 12.1541 6.39625 11.7403C5.98244 11.3265 5.98243 10.6556 6.39625 10.2417L11.6412 4.99683L16.8976 10.2523C17.3115 10.6661 17.3115 11.337 16.8977 11.7508C16.4839 12.1646 15.813 12.1646 15.3992 11.7508L11.6417 7.99337Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const DoubleArrowIcon = memo(Component);

import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = ({ className, height, width, ...rest }: CommonIconProps) => (
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
            d="M13.7161 16.0475L18.0875 11.6761C18.5703 11.1933 19.353 11.1933 19.8358 11.6761C20.3186 12.1589 20.3186 12.9416 19.8358 13.4244L13.7167 19.5435L7.58423 13.4121C7.1014 12.9293 7.10136 12.1466 7.58415 11.6638C8.06691 11.181 8.84962 11.181 9.33238 11.6638L13.7161 16.0475Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
)

export const ArrowDownIcon = memo(Component);

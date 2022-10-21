import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = ({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
        <path
            d="M6.8235 16.7059C6.3037 16.7059 5.88232 16.2845 5.88232 15.7647V9.52667C5.88232 9.15207 6.29871 8.92764 6.61162 9.13357L9.21922 10.8497L11.5997 7.00018C11.7837 6.70274 12.2163 6.70274 12.4002 7.00018L14.7807 10.8497L17.3883 9.13357C17.7012 8.92764 18.1176 9.15207 18.1176 9.52667V15.7647C18.1176 16.2845 17.6962 16.7059 17.1764 16.7059H6.8235Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const HostIcon = memo(Component);

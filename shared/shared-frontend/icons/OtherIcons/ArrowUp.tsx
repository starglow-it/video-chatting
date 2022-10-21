import React, { memo } from 'react';
import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = ({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 20 25" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 13.5425C0 13.0892 0.144606 12.6473 0.413374 12.2794L8.21928 1.59327C8.9272 0.624144 10.2983 0.404057 11.2817 1.10169C11.4738 1.23796 11.6423 1.40396 11.7806 1.59327L19.5865 12.2794C20.2944 13.2485 20.071 14.5997 19.0876 15.2973C18.7143 15.5621 18.2659 15.7047 17.8058 15.7047L14.3247 15.705L14.3254 23.7027C14.3254 24.4192 13.736 25 13.009 25H6.99083C6.2638 25 5.67443 24.4192 5.67443 23.7027L5.67373 15.705L2.19401 15.7047C0.98229 15.7047 0 14.7366 0 13.5425Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
)

export const ArrowUp = memo(Component);

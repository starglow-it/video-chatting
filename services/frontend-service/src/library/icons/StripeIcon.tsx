import React, { memo } from 'react';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';
import { CommonIconProps } from '@library/types';

const Component = ({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 25 24" fill="none" {...rest}>
        <path
            d="M11.5095 8.8305C11.5095 8.1335 12.0905 7.865 13.022 7.865C14.3785 7.865 16.1 8.2805 17.4565 9.012V4.8155C15.9785 4.225 14.5035 4 13.025 4C9.4095 4 7 5.8875 7 9.0435C7 13.978 13.775 13.178 13.775 15.306C13.775 16.131 13.0595 16.3965 12.0655 16.3965C10.5905 16.3965 8.684 15.787 7.1875 14.9745V18.99C8.72712 19.6543 10.3857 19.9988 12.0625 20.0025C15.769 20.0025 18.322 18.4085 18.322 15.2025C18.322 9.884 11.5095 10.837 11.5095 8.8305Z"
            fill="#47A7F0"
        />
    </SvgIconWrapper>
);

export const StripeIcon = memo(Component);

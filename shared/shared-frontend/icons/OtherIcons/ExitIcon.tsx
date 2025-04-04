import React, { ForwardedRef, forwardRef, memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = (
    { width, height, ...rest }: CommonIconProps,
    ref: ForwardedRef<SVGSVGElement>,
) => (
    <SvgIconWrapper
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.9947 10.5L15.31 10.5L14.9607 10.5086C11.3478 10.6906 8.50005 13.7555 8.50005 17.4756L8.5 31.5145L8.50847 31.873C8.68639 35.5812 11.6763 38.4995 15.3 38.4995L20.9743 38.5L21.1636 38.4908C22.0056 38.4032 22.6518 37.6697 22.6518 36.7922C22.6518 35.848 21.9085 35.0849 20.9947 35.0849L15.2833 35.0846L15.0137 35.0731C13.2079 34.9229 11.8143 33.3775 11.8143 31.524L11.8146 17.4597L11.8258 17.1847C11.9719 15.3414 13.4829 13.9147 15.3 13.9147L20.9743 13.9152L21.1636 13.9059C22.0056 13.8184 22.6518 13.0849 22.6518 12.2074C22.6518 11.2632 21.9085 10.5 20.9947 10.5ZM40.1857 23.7623C40.619 24.1587 40.619 24.8415 40.1857 25.2379L28.0044 36.3821C27.3628 36.9692 26.3294 36.514 26.3294 35.6443V30.9H17.0441C16.7128 30.9 16.4441 30.6313 16.4441 30.3V18.7003C16.4441 18.3689 16.7128 18.1003 17.0441 18.1003H26.3294V13.3559C26.3294 12.4862 27.3628 12.031 28.0044 12.618L40.1857 23.7623Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const ExitIcon = memo(forwardRef(Component));

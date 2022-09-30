import React, { ForwardedRef, forwardRef, memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const Component = (
    { width, height, ...rest }: CommonIconProps,
    ref: ForwardedRef<SVGSVGElement>,
) => (
    <SvgIconWrapper
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.05709 5.00134L16.6885 5L17.1746 5.00546C18.0582 5.02771 18.4391 5.12053 18.829 5.3296C19.1951 5.5259 19.4755 5.80699 19.6713 6.17405C19.8608 6.52944 19.9546 6.87731 19.9867 7.60325L19.9946 7.83277L20 8.32013V15.6799L19.9946 16.1672L19.9867 16.3967C19.9546 17.1227 19.8608 17.4706 19.6713 17.8259C19.4755 18.193 19.1951 18.4741 18.829 18.6704C18.4745 18.8605 18.1276 18.9545 17.4035 18.9867L17.1746 18.9945L16.6885 19H7.31151L6.82541 18.9945L6.59649 18.9867C5.87243 18.9545 5.52547 18.8605 5.171 18.6704C4.8049 18.4741 4.52454 18.193 4.32874 17.8259C4.13917 17.4706 4.04543 17.1227 4.01328 16.3967L4.00544 16.1672L4 15.6799L4.00133 8.06506C4.01301 7.01038 4.10284 6.59756 4.32874 6.17405C4.52454 5.80699 4.8049 5.5259 5.171 5.3296C5.56092 5.12053 5.94175 5.02771 6.82541 5.00546L7.05709 5.00134ZM15.0751 10.8293C14.6598 10.5535 14.0898 10.6045 13.7413 10.9304L13.652 11.026L12.2432 12.7592C12.204 12.8075 12.1596 12.8522 12.1108 12.8927C11.7309 13.2075 11.1582 13.2125 10.7727 12.9225L10.6725 12.8362L9.88015 12.0549C9.8146 11.9902 9.73916 11.9344 9.65612 11.889C9.21191 11.6465 8.64455 11.7468 8.33125 12.1058L8.25844 12.2009L5.6623 16.0859C5.56637 16.2295 5.51567 16.394 5.51567 16.5617C5.51567 17.0308 5.90401 17.418 6.40595 17.4748L6.53364 17.4819H17.3817C17.5471 17.4819 17.71 17.4455 17.8563 17.3758C18.3154 17.1571 18.5132 16.6661 18.3348 16.2382L18.2823 16.1327L15.373 11.1419C15.3011 11.0187 15.1993 10.9118 15.0751 10.8293ZM5.93696 8.41566C5.93696 7.60054 6.59676 6.93976 7.41065 6.93976C8.22454 6.93976 8.88433 7.60054 8.88433 8.41566C8.88433 9.23078 8.22454 9.89157 7.41065 9.89157C6.59676 9.89157 5.93696 9.23078 5.93696 8.41566Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const TemplatesIcon = memo(forwardRef(Component));

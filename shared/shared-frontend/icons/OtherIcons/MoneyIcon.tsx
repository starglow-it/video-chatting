import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from '../SvgIconWrapper';

const MoneyIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.6569 6.34313C16.1459 4.83213 14.1369 4 12 4C9.86312 4 7.85413 4.83213 6.34313 6.34313C4.83213 7.85413 4 9.86312 4 12C4 14.1369 4.83216 16.1458 6.34313 17.6569C7.85409 19.1679 9.86312 20 12 20C14.1369 20 16.1459 19.1679 17.6569 17.6569C19.1679 16.1459 20 14.1369 20 12C20 9.86312 19.1678 7.85416 17.6569 6.34313ZM12 11.5C13.2407 11.5 14.25 12.5093 14.25 13.75C14.25 14.7774 13.5576 15.6456 12.6151 15.9138C12.5473 15.9331 12.5 15.994 12.5 16.0644V16.4859C12.5 16.7551 12.2931 16.9868 12.0242 16.9994C11.737 17.0129 11.5 16.7842 11.5 16.5V16.0643C11.5 15.9941 11.4529 15.9332 11.3854 15.914C10.4469 15.6471 9.75628 14.7854 9.75003 13.764C9.74837 13.4913 9.96275 13.258 10.2353 13.2502C10.5182 13.2421 10.75 13.469 10.75 13.75C10.75 14.4688 11.3599 15.0479 12.0893 14.9969C12.7051 14.9538 13.2039 14.455 13.2469 13.8393C13.2978 13.1098 12.7188 12.5 12 12.5C10.7593 12.5 9.75 11.4907 9.75 10.25C9.75 9.22259 10.4424 8.35441 11.3849 8.08616C11.4527 8.06687 11.5 8.00597 11.5 7.93556V7.51412C11.5 7.24487 11.7069 7.01322 11.9758 7.00056C12.263 6.98706 12.5 7.21584 12.5 7.5V7.93566C12.5 8.00588 12.5471 8.06681 12.6146 8.08603C13.5531 8.35291 14.2437 9.21456 14.25 10.236C14.2516 10.5087 14.0373 10.742 13.7647 10.7498C13.4818 10.7579 13.25 10.531 13.25 10.25C13.25 9.53119 12.6401 8.95212 11.9107 9.00312C11.2949 9.04616 10.7961 9.54497 10.7531 10.1607C10.7022 10.8902 11.2812 11.5 12 11.5Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { MoneyIcon };

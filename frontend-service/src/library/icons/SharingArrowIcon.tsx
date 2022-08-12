import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const SharingArrowIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 16 16" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.99174 4C9.07107 4 9.1473 4.03144 9.20434 4.08769L12.5733 7.40994C12.6947 7.52975 12.6981 7.72736 12.5806 7.85133L9.20434 11.1811C9.08285 11.3009 8.88918 11.2975 8.77177 11.1736C8.71664 11.1154 8.68582 11.0376 8.68582 10.9566L8.68561 9.5155L7.48436 9.51577C6.63614 9.51577 5.83744 9.7377 5.13837 10.1291C4.77704 10.3314 4.35184 10.6998 3.86277 11.2342C3.74747 11.3602 3.55388 11.367 3.43039 11.2493C3.36833 11.1902 3.33315 11.1074 3.33325 11.0208L3.3335 10.8192C3.3335 7.9397 5.56358 5.60538 8.31453 5.60538L8.68561 5.60511L8.68582 4.31216C8.68582 4.13976 8.82279 4 8.99174 4Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { SharingArrowIcon };

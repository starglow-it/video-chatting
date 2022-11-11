import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = memo(({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        viewBox="0 0 28 28"
        fill="none"
        {...rest}
    >
        <path fillRule="evenodd" clipRule="evenodd" d="M7.74677 7.74659C10.2978 5.19556 14.4338 5.19556 16.9849 7.74659C19.3286 10.0903 19.519 13.7719 17.5562 16.3331C18.0228 16.25 18.5216 16.3896 18.8828 16.7508L21.7253 19.5933C22.314 20.182 22.314 21.1364 21.7253 21.7251C21.1366 22.3138 20.1821 22.3138 19.5934 21.7251L16.7509 18.8826C16.3898 18.5215 16.2502 18.0226 16.3322 17.555C13.7721 19.5189 10.0905 19.3284 7.74677 16.9847C5.19574 14.4337 5.19574 10.2976 7.74677 7.74659ZM9.16792 9.16774C7.40183 10.9338 7.40183 13.7972 9.16792 15.5633C10.934 17.3294 13.7974 17.3294 15.5635 15.5633C17.3296 13.7972 17.3296 10.9338 15.5635 9.16774C13.7974 7.40164 10.934 7.40164 9.16792 9.16774Z" fill="currentColor" />
    </SvgIconWrapper>
));

export const SearchIcon  = memo(Component);

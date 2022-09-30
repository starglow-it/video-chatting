import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const AcceptIcon = memo(({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        width={width}
        height={height}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.8298 13.6516L15.7681 8.71337C16.1576 8.3239 16.789 8.3239 17.1785 8.71337C17.568 9.10284 17.568 9.7343 17.1785 10.1238L10.8303 16.4719L6.82432 12.4668C6.4348 12.0773 6.43476 11.4459 6.82424 11.0564C7.21369 10.6669 7.84511 10.6669 8.23456 11.0564L10.8298 13.6516Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { AcceptIcon };

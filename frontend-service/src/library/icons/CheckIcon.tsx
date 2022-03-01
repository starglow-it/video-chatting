import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from './SvgIconWrapper';

const CheckIcon = memo(({ width, height, className, onClick }: CommonIconProps) => {
    return (
        <SvgIconWrapper
            width={width}
            height={height}
            className={className}
            onClick={onClick}
            viewBox="0 0 24 24"
        >
            <rect width="24" height="24" rx="5" fill="#FF884E" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0053 13.2549L16.2522 8.008C16.666 7.59419 17.3369 7.59419 17.7507 8.008C18.1645 8.42181 18.1645 9.09273 17.7507 9.50655L11.0058 16.2515L6.7494 11.996C6.33553 11.5822 6.33549 10.9113 6.74932 10.4974C7.16311 10.0837 7.83399 10.0837 8.24778 10.4974L11.0053 13.2549Z"
                fill="white"
            />
        </SvgIconWrapper>
    );
});

export { CheckIcon };

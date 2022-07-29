import { memo } from 'react';

import { CommonIconProps } from '@library/types';

const Component = ({ width, height, className, onClick, ...rest }: CommonIconProps) => {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            onClick={onClick}
            viewBox="0 0 21 20"
            fill="none"
            {...rest}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.46402 11.4624L13.8364 7.08992C14.1813 6.74507 14.7404 6.74507 15.0852 7.08992C15.4301 7.43476 15.4301 7.99386 15.0852 8.33871L9.46447 13.9595L5.91747 10.4132C5.57258 10.0684 5.57255 9.50931 5.9174 9.16446C6.26222 8.81963 6.82129 8.81963 7.16612 9.16446L9.46402 11.4624Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const RoundCheckIcon = memo(Component);

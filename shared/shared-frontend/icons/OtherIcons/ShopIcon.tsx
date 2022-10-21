import { SvgIconWrapper } from '../SvgIconWrapper';
import React, { memo } from 'react';
import { CommonIconProps } from '../types';

const Component = ({ className, onClick, width, height }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 25 24"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.89414 7.75713V6.59999C8.89414 5.32185 9.93028 4.28571 11.2084 4.28571H14.2941C15.5723 4.28571 16.6084 5.32185 16.6084 6.59999V7.75713H18.0327C19.3782 7.75713 20.44 8.90056 20.3406 10.2424L19.7978 17.571C19.7083 18.7795 18.7016 19.7143 17.4898 19.7143H8.01254C6.80072 19.7143 5.7941 18.7795 5.70458 17.571L5.16172 10.2424C5.06233 8.90056 6.12419 7.75713 7.46969 7.75713H8.89414ZM10.437 6.59999C10.437 6.17394 10.7824 5.82856 11.2084 5.82856H14.2941C14.7202 5.82856 15.0656 6.17394 15.0656 6.59999V7.75713H10.437V6.59999ZM9.66557 15.0857C9.23952 15.0857 8.89414 15.4311 8.89414 15.8571C8.89414 16.2832 9.23952 16.6286 9.66557 16.6286H15.837C16.263 16.6286 16.6084 16.2832 16.6084 15.8571C16.6084 15.4311 16.263 15.0857 15.837 15.0857H9.66557Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const ShopIcon = memo(Component);

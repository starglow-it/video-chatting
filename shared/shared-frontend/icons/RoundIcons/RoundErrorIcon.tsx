import { memo } from 'react';

import { CommonIconProps } from '../types';

const Component = ({ width, height, className, onClick, ...rest }: CommonIconProps) => (
    <svg
        className={className}
        width={width}
        height={height}
        onClick={onClick}
        viewBox="0 0 16 16"
        fill="none"
        {...rest}
    >
        <circle cx="8" cy="8" r="8" fill="#F55252" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.9665 5.03364C11.2268 5.29399 11.2268 5.7161 10.9665 5.97645L8.94281 8.00014L10.9665 10.0238C11.2268 10.2842 11.2268 10.7063 10.9665 10.9666C10.7061 11.227 10.284 11.227 10.0237 10.9666L8 8.94295L5.97631 10.9666C5.71596 11.227 5.29385 11.227 5.0335 10.9666C4.77315 10.7063 4.77315 10.2842 5.0335 10.0238L7.05719 8.00014L5.0335 5.97645C4.77315 5.7161 4.77315 5.29399 5.0335 5.03364C5.29385 4.77329 5.71596 4.77329 5.97631 5.03364L8 7.05733L10.0237 5.03364C10.284 4.77329 10.7061 4.77329 10.9665 5.03364Z"
            fill="white"
        />
    </svg>
);

export const RoundErrorIcon = memo(Component);

import React, { memo } from 'react';

import { SvgIconWrapper } from '../SvgIconWrapper';

import { CommonIconProps } from '../types';

const Component = ({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        className={className}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.821 15.3005C17.7213 14.371 17.0908 13.0124 17.0908 11.5731V9.54548C17.0908 7.21847 15.519 5.25578 13.3826 4.65197L12.9252 4.53637C12.8861 4.5278 12.8442 4.51994 12.7946 4.51279V4.22025C12.7946 3.77829 12.4363 3.42001 11.9943 3.42001C11.5524 3.42001 11.1941 3.77829 11.1941 4.22025V4.51279L11.0525 4.53879L10.792 4.60586C8.56647 5.14958 6.90888 7.15536 6.90888 9.54548V11.5731C6.90888 13.0124 6.27832 14.3709 5.17223 15.3062C4.88925 15.5484 4.72705 15.9004 4.72705 16.2727C4.72705 16.9747 5.29794 17.5455 5.99987 17.5455H17.9999C18.7017 17.5455 19.2726 16.9747 19.2726 16.2727C19.2726 15.9004 19.1104 15.5484 18.821 15.3005ZM14.6718 18.2728C14.4186 19.5156 13.3168 20.4546 11.9998 20.4546C10.6826 20.4546 9.58077 19.5156 9.32775 18.2728H14.6718Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
)

export const BellIcon = memo(Component);
